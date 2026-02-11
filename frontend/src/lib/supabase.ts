import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cdjmletytzxiezgibzjm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkam1sZXR5dHp4aWV6Z2liemptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NzQ1NjMsImV4cCI6MjA4NjM1MDU2M30.lXiXJYiQe0VklEPLMcIQjJdMsqXUuEVB4ghNtWXzwck';

export const supabase = createClient(supabaseUrl, supabaseKey);
