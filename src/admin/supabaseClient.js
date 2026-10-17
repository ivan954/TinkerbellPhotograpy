import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "../content/config";

// Only the admin screen uses the full client; the public site reads content
// with a plain fetch (see content/ContentProvider.js) to keep its bundle small.
const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export default supabase;
