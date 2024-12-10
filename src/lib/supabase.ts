import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ppywzrizeqvtxhbfscki.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweXd6cml6ZXF2dHhoYmZzY2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3OTkyNTYsImV4cCI6MjA0OTM3NTI1Nn0.UelPRaTK2bEFHUiv20JabM99EEdRsU0V8qXncSaBEKw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);