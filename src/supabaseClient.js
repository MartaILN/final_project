//supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://majnlduvgllragqrokki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ham5sZHV2Z2xscmFncXJva2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMTE4MDAsImV4cCI6MjA2OTg4NzgwMH0.srN4ix05JF2FOBMMnyogKDpjk980xNQy3jUEcXAHaDk';

export const supabase = createClient(supabaseUrl, supabaseKey);

