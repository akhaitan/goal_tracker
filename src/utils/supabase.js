import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kjjxfjwabcaorhgurvpq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqanhmandhYmNhb3JoZ3VydnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjIzMjcsImV4cCI6MjA4NjQ5ODMyN30.ypVYR-V1FvvluBfen-KaVS_KNmI612IfK6FOfGmYMzc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
