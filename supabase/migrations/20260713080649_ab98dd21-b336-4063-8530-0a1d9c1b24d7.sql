
-- =========== PROFILES ===========
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile r" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile u" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "own profile i" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- auto create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;$$;

CREATE TRIGGER t_profiles_uat BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========== CHILD PROFILES ===========
CREATE TABLE public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  avatar_url TEXT,
  pin TEXT,
  interests TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'en',
  sparks_balance INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.child_profiles TO authenticated;
GRANT ALL ON public.child_profiles TO service_role;
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parent manages children" ON public.child_profiles FOR ALL
  USING (auth.uid() = parent_user_id) WITH CHECK (auth.uid() = parent_user_id);
CREATE TRIGGER t_child_profiles_uat BEFORE UPDATE ON public.child_profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- helper: does current user own this child?
CREATE OR REPLACE FUNCTION public.owns_child(_child_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.child_profiles
    WHERE id = _child_id AND parent_user_id = auth.uid());
$$;

-- =========== CURIOS ===========
CREATE TABLE public.curios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  query TEXT,
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.curios TO authenticated;
GRANT ALL ON public.curios TO service_role;
ALTER TABLE public.curios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "curios by owned child" ON public.curios FOR ALL
  USING (public.owns_child(child_id)) WITH CHECK (public.owns_child(child_id));

-- =========== CONTENT BLOCKS ===========
CREATE TABLE public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curio_id UUID NOT NULL REFERENCES public.curios(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  specialist_id TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  liked BOOLEAN NOT NULL DEFAULT false,
  bookmarked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_blocks TO authenticated;
GRANT ALL ON public.content_blocks TO service_role;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocks by owned curio" ON public.content_blocks FOR ALL
  USING (EXISTS (SELECT 1 FROM public.curios c WHERE c.id = curio_id AND public.owns_child(c.child_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.curios c WHERE c.id = curio_id AND public.owns_child(c.child_id)));

-- =========== BLOCK REPLIES ===========
CREATE TABLE public.block_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID NOT NULL REFERENCES public.content_blocks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  from_user BOOLEAN NOT NULL DEFAULT true,
  specialist_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.block_replies TO authenticated;
GRANT ALL ON public.block_replies TO service_role;
ALTER TABLE public.block_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "replies by owned block" ON public.block_replies FOR ALL
  USING (EXISTS (SELECT 1 FROM public.content_blocks b JOIN public.curios c ON c.id=b.curio_id WHERE b.id = block_id AND public.owns_child(c.child_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.content_blocks b JOIN public.curios c ON c.id=b.curio_id WHERE b.id = block_id AND public.owns_child(c.child_id)));

-- =========== CURIO IMAGES (shared cache) ===========
CREATE TABLE public.curio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  image_url TEXT NOT NULL,
  generation_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX curio_images_topic_idx ON public.curio_images(topic);
GRANT SELECT, INSERT ON public.curio_images TO authenticated;
GRANT ALL ON public.curio_images TO service_role;
ALTER TABLE public.curio_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "any authed can read images" ON public.curio_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "any authed can insert images" ON public.curio_images FOR INSERT TO authenticated WITH CHECK (true);

-- =========== SPARKS TRANSACTIONS ===========
CREATE TABLE public.sparks_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sparks_transactions TO authenticated;
GRANT ALL ON public.sparks_transactions TO service_role;
ALTER TABLE public.sparks_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sparks by owned child" ON public.sparks_transactions FOR ALL
  USING (public.owns_child(child_id)) WITH CHECK (public.owns_child(child_id));

-- keep child_profiles.sparks_balance in sync
CREATE OR REPLACE FUNCTION public.apply_sparks_tx()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.child_profiles SET sparks_balance = GREATEST(0, sparks_balance + NEW.amount)
  WHERE id = NEW.child_id;
  RETURN NEW;
END;$$;
CREATE TRIGGER t_apply_sparks AFTER INSERT ON public.sparks_transactions
FOR EACH ROW EXECUTE FUNCTION public.apply_sparks_tx();

-- =========== TASKS ===========
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sparks_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parent owns tasks" ON public.tasks FOR ALL
  USING (auth.uid() = parent_user_id) WITH CHECK (auth.uid() = parent_user_id);

-- =========== CHILD TASKS ===========
CREATE TABLE public.child_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.child_tasks TO authenticated;
GRANT ALL ON public.child_tasks TO service_role;
ALTER TABLE public.child_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "child tasks by owned child" ON public.child_tasks FOR ALL
  USING (public.owns_child(child_profile_id)) WITH CHECK (public.owns_child(child_profile_id));

-- =========== LEARNING HISTORY ===========
CREATE TABLE public.learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  topic TEXT,
  interaction_type TEXT,
  content_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  interaction_date TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_history TO authenticated;
GRANT ALL ON public.learning_history TO service_role;
ALTER TABLE public.learning_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "history by owned child" ON public.learning_history FOR ALL
  USING (public.owns_child(child_id)) WITH CHECK (public.owns_child(child_id));

-- =========== CHILD DAILY ACTIVITY ===========
CREATE TABLE public.child_daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  topics_explored INTEGER NOT NULL DEFAULT 0,
  sparks_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(child_profile_id, activity_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.child_daily_activity TO authenticated;
GRANT ALL ON public.child_daily_activity TO service_role;
ALTER TABLE public.child_daily_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity by owned child" ON public.child_daily_activity FOR ALL
  USING (public.owns_child(child_profile_id)) WITH CHECK (public.owns_child(child_profile_id));

-- =========== LEARNING TOPICS ===========
CREATE TABLE public.learning_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  child_age INTEGER NOT NULL DEFAULT 10,
  total_sections INTEGER NOT NULL DEFAULT 0,
  current_section INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'planning',
  table_of_contents JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_topics TO authenticated;
GRANT ALL ON public.learning_topics TO service_role;
ALTER TABLE public.learning_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topics by owned child" ON public.learning_topics FOR ALL
  USING (public.owns_child(child_id)) WITH CHECK (public.owns_child(child_id));
CREATE TRIGGER t_topics_uat BEFORE UPDATE ON public.learning_topics
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========== LEARNING SECTIONS ===========
CREATE TABLE public.learning_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.learning_topics(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  facts JSONB NOT NULL DEFAULT '[]'::jsonb,
  story_mode_content TEXT,
  image_url TEXT,
  image_generated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_sections TO authenticated;
GRANT ALL ON public.learning_sections TO service_role;
ALTER TABLE public.learning_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sections by owned topic" ON public.learning_sections FOR ALL
  USING (EXISTS (SELECT 1 FROM public.learning_topics t WHERE t.id = topic_id AND public.owns_child(t.child_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.learning_topics t WHERE t.id = topic_id AND public.owns_child(t.child_id)));
CREATE TRIGGER t_sections_uat BEFORE UPDATE ON public.learning_sections
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
