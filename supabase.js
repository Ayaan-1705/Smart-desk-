import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://aisjlblilvyhfvnuyhjd.supabase.co";

const SUPABASE_KEY = "sb_publishable_ZlljIRBDlewOayZOR8uRCQ_FLtasRMo";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);