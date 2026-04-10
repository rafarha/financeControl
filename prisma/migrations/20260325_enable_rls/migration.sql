-- Migration: enable RLS and create per-table policies
-- Date: 2026-03-25
-- NOTE: This migration assumes you're using Supabase/Postgres with the `auth.uid()` function available
-- If you use another auth system, adapt the policy expressions accordingly.

-- Enable RLS and create policies for tables that contain a user_id column
-- USERS
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_rls_select ON public.users;
CREATE POLICY users_rls_select ON public.users
  FOR SELECT
  USING (id = auth.uid());
DROP POLICY IF EXISTS users_rls_insert ON public.users;
CREATE POLICY users_rls_insert ON public.users
  FOR INSERT
  WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS users_rls_update ON public.users;
CREATE POLICY users_rls_update ON public.users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS users_rls_delete ON public.users;
CREATE POLICY users_rls_delete ON public.users
  FOR DELETE
  USING (id = auth.uid());

-- SESSIONS
ALTER TABLE IF EXISTS public.sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sessions_rls_select ON public.sessions;
CREATE POLICY sessions_rls_select ON public.sessions
  FOR SELECT
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS sessions_rls_insert ON public.sessions;
CREATE POLICY sessions_rls_insert ON public.sessions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS sessions_rls_update ON public.sessions;
CREATE POLICY sessions_rls_update ON public.sessions
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS sessions_rls_delete ON public.sessions;
CREATE POLICY sessions_rls_delete ON public.sessions
  FOR DELETE
  USING (user_id = auth.uid());

-- ACCOUNT
ALTER TABLE IF EXISTS public.account ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS account_rls_select ON public.account;
CREATE POLICY account_rls_select ON public.account
  FOR SELECT
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS account_rls_insert ON public.account;
CREATE POLICY account_rls_insert ON public.account
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS account_rls_update ON public.account;
CREATE POLICY account_rls_update ON public.account
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS account_rls_delete ON public.account;
CREATE POLICY account_rls_delete ON public.account
  FOR DELETE
  USING (user_id = auth.uid());

-- SETTINGS
ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS settings_rls_select ON public.settings;
CREATE POLICY settings_rls_select ON public.settings
  FOR SELECT
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS settings_rls_insert ON public.settings;
CREATE POLICY settings_rls_insert ON public.settings
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS settings_rls_update ON public.settings;
CREATE POLICY settings_rls_update ON public.settings
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS settings_rls_delete ON public.settings;
CREATE POLICY settings_rls_delete ON public.settings
  FOR DELETE
  USING (user_id = auth.uid());

-- CATEGORIES
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS categories_rls_select ON public.categories;
CREATE POLICY categories_rls_select ON public.categories
  FOR SELECT
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS categories_rls_insert ON public.categories;
CREATE POLICY categories_rls_insert ON public.categories
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS categories_rls_update ON public.categories;
CREATE POLICY categories_rls_update ON public.categories
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS categories_rls_delete ON public.categories;
CREATE POLICY categories_rls_delete ON public.categories
  FOR DELETE
  USING (user_id = auth.uid());

-- PROJECTS
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS projects_rls_select ON public.projects;
CREATE POLICY projects_rls_select ON public.projects
  FOR SELECT
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS projects_rls_insert ON public.projects;
CREATE POLICY projects_rls_insert ON public.projects
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS projects_rls_update ON public.projects;
CREATE POLICY projects_rls_update ON public.projects
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS projects_rls_delete ON public.projects;
CREATE POLICY projects_rls_delete ON public.projects
  FOR DELETE
  USING (user_id = auth.uid());

-- FIELDS
ALTER TABLE IF EXISTS public.fields ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fields_rls_select ON public.fields;
CREATE POLICY fields_rls_select ON public.fields
  FOR SELECT
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS fields_rls_insert ON public.fields;
CREATE POLICY fields_rls_insert ON public.fields
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS fields_rls_update ON public.fields;
CREATE POLICY fields_rls_update ON public.fields
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS fields_rls_delete ON public.fields;
CREATE POLICY fields_rls_delete ON public.fields
  FOR DELETE
  USING (user_id = auth.uid());

-- FILES
ALTER TABLE IF EXISTS public.files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS files_rls_select ON public.files;
CREATE POLICY files_rls_select ON public.files
  FOR SELECT
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS files_rls_insert ON public.files;
CREATE POLICY files_rls_insert ON public.files
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS files_rls_update ON public.files;
CREATE POLICY files_rls_update ON public.files
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS files_rls_delete ON public.files;
CREATE POLICY files_rls_delete ON public.files
  FOR DELETE
  USING (user_id = auth.uid());

-- TRANSACTIONS
ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS transactions_rls_select ON public.transactions;
CREATE POLICY transactions_rls_select ON public.transactions
  FOR SELECT
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS transactions_rls_insert ON public.transactions;
CREATE POLICY transactions_rls_insert ON public.transactions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS transactions_rls_update ON public.transactions;
CREATE POLICY transactions_rls_update ON public.transactions
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS transactions_rls_delete ON public.transactions;
CREATE POLICY transactions_rls_delete ON public.transactions
  FOR DELETE
  USING (user_id = auth.uid());

-- CURRENCIES: allow global currencies (user_id IS NULL) or per-user
ALTER TABLE IF EXISTS public.currencies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS currencies_rls_select ON public.currencies;
CREATE POLICY currencies_rls_select ON public.currencies
  FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());
DROP POLICY IF EXISTS currencies_rls_insert ON public.currencies;
CREATE POLICY currencies_rls_insert ON public.currencies
  FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
DROP POLICY IF EXISTS currencies_rls_update ON public.currencies;
CREATE POLICY currencies_rls_update ON public.currencies
  FOR UPDATE
  USING (user_id IS NULL OR user_id = auth.uid())
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
DROP POLICY IF EXISTS currencies_rls_delete ON public.currencies;
CREATE POLICY currencies_rls_delete ON public.currencies
  FOR DELETE
  USING (user_id IS NULL OR user_id = auth.uid());

-- APP_DATA
ALTER TABLE IF EXISTS public.app_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS app_data_rls_select ON public.app_data;
CREATE POLICY app_data_rls_select ON public.app_data
  FOR SELECT
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS app_data_rls_insert ON public.app_data;
CREATE POLICY app_data_rls_insert ON public.app_data
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS app_data_rls_update ON public.app_data;
CREATE POLICY app_data_rls_update ON public.app_data
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS app_data_rls_delete ON public.app_data;
CREATE POLICY app_data_rls_delete ON public.app_data
  FOR DELETE
  USING (user_id = auth.uid());

-- PROGRESS
ALTER TABLE IF EXISTS public.progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS progress_rls_select ON public.progress;
CREATE POLICY progress_rls_select ON public.progress
  FOR SELECT
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS progress_rls_insert ON public.progress;
CREATE POLICY progress_rls_insert ON public.progress
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS progress_rls_update ON public.progress;
CREATE POLICY progress_rls_update ON public.progress
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS progress_rls_delete ON public.progress;
CREATE POLICY progress_rls_delete ON public.progress
  FOR DELETE
  USING (user_id = auth.uid());

-- If you rely on service_role execution for background jobs, the service role bypasses RLS.
-- Review these policies and adjust to your needs (e.g., allow public selects, admin roles, or different checks).
