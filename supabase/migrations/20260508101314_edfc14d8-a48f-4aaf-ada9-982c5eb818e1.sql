
-- handle_new_user chỉ chạy bởi trigger (postgres), không ai khác cần gọi
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- has_role: chỉ cần authenticated dùng trong policies
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
