const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
// Prefer service role key on server for privileged operations; fall back to anon key if service key missing
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase config missing. Set SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) in env.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  // allow running in server environments
  auth: { persistSession: false }
});

module.exports = supabase;
