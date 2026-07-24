
REVOKE EXECUTE ON FUNCTION public.generate_journalist_id() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_journalist_id() TO service_role;
