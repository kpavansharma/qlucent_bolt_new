import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvrenqihbolthvmrlbgv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2cmVucWloYm9sdGh2bXJsYmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDMyMjYsImV4cCI6MjA2NTAxOTIyNn0.i_vPTUc7VYnHYpK9tG7KxfofKrY2GHy_WABTNPcaHBY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);