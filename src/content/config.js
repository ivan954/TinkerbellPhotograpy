// Supabase project settings, from .env (see .env.example).
// The anon/publishable key is meant to be public: what it can do is limited by
// the row-level security policies in supabase/schema.sql.
export const SUPABASE_URL = (process.env.REACT_APP_SUPABASE_URL || "").replace(/\/$/, "");
export const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";
export const IMAGES_BUCKET = "site-images";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
