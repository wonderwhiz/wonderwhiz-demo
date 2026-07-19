
GRANT SELECT, INSERT, UPDATE, DELETE ON public.child_profiles TO authenticated;
GRANT ALL ON public.child_profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.child_daily_activity TO authenticated;
GRANT ALL ON public.child_daily_activity TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.child_tasks TO authenticated;
GRANT ALL ON public.child_tasks TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.curios TO authenticated;
GRANT ALL ON public.curios TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.curio_images TO authenticated;
GRANT SELECT ON public.curio_images TO anon;
GRANT ALL ON public.curio_images TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_blocks TO authenticated;
GRANT ALL ON public.content_blocks TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.block_replies TO authenticated;
GRANT ALL ON public.block_replies TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_history TO authenticated;
GRANT ALL ON public.learning_history TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_sections TO authenticated;
GRANT ALL ON public.learning_sections TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_topics TO authenticated;
GRANT ALL ON public.learning_topics TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sparks_transactions TO authenticated;
GRANT ALL ON public.sparks_transactions TO service_role;
