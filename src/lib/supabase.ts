import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigError = !supabaseUrl || !supabaseAnonKey
  ? new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY antes de usar o painel administrativo.')
  : null

export const supabase = supabaseConfigError
  ? ({
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        update: () => ({ data: null, error: null }),
        insert: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    } as any)
  : createClient(supabaseUrl, supabaseAnonKey)
