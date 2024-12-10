import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztfbooks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0ZmJvb2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc1MzY5NjAsImV4cCI6MjAyMzExMjk2MH0.KZL2QKQIwRu6n9Q2Z2Q2Z2Q2Z2Q2Z2Q2Z2Q2Z2Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);