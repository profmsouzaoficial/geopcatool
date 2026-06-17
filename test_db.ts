import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: d1, error: e1 } = await supabase.from('geojson').select('*').limit(1);
  console.log('geojson', e1 ? e1.message : d1);
  const { data: d2, error: e2 } = await supabase.from('health_units').select('*').limit(1);
  console.log('health_units', e2 ? e2.message : d2);
}
run();
