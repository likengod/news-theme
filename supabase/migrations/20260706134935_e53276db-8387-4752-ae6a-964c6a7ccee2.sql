
REVOKE EXECUTE ON FUNCTION public.generate_public_user_id() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_public_user_id() TO service_role;
