-- Execute THIRD only AFTER creating your login user under Authentication > Users.
-- Replace ADMIN_EMAIL_HERE with the exact email used to create the account.
-- NEVER paste a password here. Do NOT execute with placeholder unchanged.
-- Role can be transferred later by adding a new account then revoking the old one.
DO $$
DECLARE admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE lower(email)=lower('mohamedeng3572@gmail.com');
  IF admin_id IS NULL THEN RAISE EXCEPTION 'Create and confirm the Auth user first, then replace ADMIN_EMAIL_HERE'; END IF;
  INSERT INTO public.admin_users(user_id) VALUES(admin_id) ON CONFLICT DO NOTHING;
END $$;
-- To revoke former admin after the new user is verified:
-- DELETE FROM public.admin_users WHERE user_id = 'OLD_USER_UUID';
