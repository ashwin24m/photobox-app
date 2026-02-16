// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://qsissqdraatvdhscrxog.supabase.co'

// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaXNzcWRyYWF0dmRoc2NyeG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMTk1NzIsImV4cCI6MjA4Njc5NTU3Mn0.P2UmmVgNic18pMUTNydClau7BwAFnUyIDKZSkDcD1vs'

// export const supabase = createClient(supabaseUrl, supabaseKey)






import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
