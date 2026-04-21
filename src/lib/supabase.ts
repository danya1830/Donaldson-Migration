import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bhxuozbwrvdufsiaygmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeHVvemJ3cnZkdWZzaWF5Z21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjcxNTAsImV4cCI6MjA2MjA0MzE1MH0.WG8F1P1W1V8YLI1W1V8YLI1W1V8YLI1W1V8YLI1W1V8';

export const supabase = createClient(supabaseUrl, supabaseKey);