'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from './lib/supabase_client'
import type { Session } from '@supabase/supabase-js'
export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      setSession(session)
    }
    getSession();
  }, [])

  if (!session) {
    return <p>You must be logged in to view this page.</p>
  }

  return <h1>Welcome {JSON.stringify(session)}</h1>
}