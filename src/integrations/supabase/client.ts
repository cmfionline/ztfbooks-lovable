import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ppywzrizeqvtxhbfscki.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweXd6cml6ZXF2dHhoYmZzY2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3OTkyNTYsImV4cCI6MjA0OTM3NTI1Nn0.UelPRaTK2bEFHUiv20JabM99EEdRsU0V8qXncSaBEKw";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);