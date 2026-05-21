import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qkvwuyaencbxnfnchhtp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdnd1eWFlbmNieG5mbmNoaHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDU5ODgsImV4cCI6MjA5NDg4MTk4OH0.wGYuZxXs6sjP-qIKBIdmbHfvg8DO_58GpOoTD5UKiFY';
export const supabase = createClient(supabaseUrl, supabaseKey);
