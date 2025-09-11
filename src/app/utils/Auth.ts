import { supabaseClient } from '@/app/lib/supabase_client'

export const signUp = async (email :string,password:string) => {
  const { data, error } = await supabaseClient.auth.signUp({ email, password })
  return { data, error }
}

export const signIn = async (email:string, password:string) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const signOut = async () => {
  await supabaseClient.auth.signOut()
}