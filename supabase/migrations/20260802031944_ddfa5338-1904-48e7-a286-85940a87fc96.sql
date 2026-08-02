
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.owns_child(_child_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.child_profiles
    WHERE id = _child_id AND parent_user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION private.owns_child(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.owns_child(uuid) TO authenticated, service_role;

DROP POLICY "replies by owned block" ON public.block_replies;
CREATE POLICY "replies by owned block" ON public.block_replies FOR ALL
USING (EXISTS (SELECT 1 FROM public.content_blocks b JOIN public.curios c ON c.id = b.curio_id
  WHERE b.id = block_replies.block_id AND private.owns_child(c.child_id)))
WITH CHECK (EXISTS (SELECT 1 FROM public.content_blocks b JOIN public.curios c ON c.id = b.curio_id
  WHERE b.id = block_replies.block_id AND private.owns_child(c.child_id)));

DROP POLICY "activity by owned child" ON public.child_daily_activity;
CREATE POLICY "activity by owned child" ON public.child_daily_activity FOR ALL
USING (private.owns_child(child_profile_id)) WITH CHECK (private.owns_child(child_profile_id));

DROP POLICY "child tasks by owned child" ON public.child_tasks;
CREATE POLICY "child tasks by owned child" ON public.child_tasks FOR ALL
USING (private.owns_child(child_profile_id)) WITH CHECK (private.owns_child(child_profile_id));

DROP POLICY "blocks by owned curio" ON public.content_blocks;
CREATE POLICY "blocks by owned curio" ON public.content_blocks FOR ALL
USING (EXISTS (SELECT 1 FROM public.curios c WHERE c.id = content_blocks.curio_id AND private.owns_child(c.child_id)))
WITH CHECK (EXISTS (SELECT 1 FROM public.curios c WHERE c.id = content_blocks.curio_id AND private.owns_child(c.child_id)));

DROP POLICY "curios by owned child" ON public.curios;
CREATE POLICY "curios by owned child" ON public.curios FOR ALL
USING (private.owns_child(child_id)) WITH CHECK (private.owns_child(child_id));

DROP POLICY "history by owned child" ON public.learning_history;
CREATE POLICY "history by owned child" ON public.learning_history FOR ALL
USING (private.owns_child(child_id)) WITH CHECK (private.owns_child(child_id));

DROP POLICY "sections by owned topic" ON public.learning_sections;
CREATE POLICY "sections by owned topic" ON public.learning_sections FOR ALL
USING (EXISTS (SELECT 1 FROM public.learning_topics t WHERE t.id = learning_sections.topic_id AND private.owns_child(t.child_id)))
WITH CHECK (EXISTS (SELECT 1 FROM public.learning_topics t WHERE t.id = learning_sections.topic_id AND private.owns_child(t.child_id)));

DROP POLICY "topics by owned child" ON public.learning_topics;
CREATE POLICY "topics by owned child" ON public.learning_topics FOR ALL
USING (private.owns_child(child_id)) WITH CHECK (private.owns_child(child_id));

DROP POLICY "sparks by owned child" ON public.sparks_transactions;
CREATE POLICY "sparks by owned child" ON public.sparks_transactions FOR ALL
USING (private.owns_child(child_id)) WITH CHECK (private.owns_child(child_id));

DROP FUNCTION IF EXISTS public.owns_child(uuid);

-- curio_images: read-only shared cache; writes only via service role
DROP POLICY IF EXISTS "any authed can insert images" ON public.curio_images;
DROP POLICY IF EXISTS "any authed can read images" ON public.curio_images;
CREATE POLICY "authed can read cached images" ON public.curio_images FOR SELECT TO authenticated USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.curio_images FROM authenticated;
REVOKE ALL ON public.curio_images FROM anon;
GRANT SELECT ON public.curio_images TO authenticated;
GRANT ALL ON public.curio_images TO service_role;
