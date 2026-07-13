
-- lock down SECURITY DEFINER helpers
ALTER FUNCTION public.tg_set_updated_at() SET search_path = public;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_sparks_tx() FROM PUBLIC, anon, authenticated;

-- owns_child is called from RLS policies, needs to run as invoker via SECURITY DEFINER
REVOKE ALL ON FUNCTION public.owns_child(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_child(uuid) TO authenticated, service_role;

-- fully scoped policies (already scoped; linter flagged permissive USING(true) on curio_images SELECT which is intentional public-cache — keep as-is)
