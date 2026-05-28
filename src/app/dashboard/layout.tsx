'use client'

import { useEffect, useState }
from 'react'

import { useRouter }
from 'next/navigation'

import { supabase }
from '../../lib/supabase'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    async function checkUser() {

      const {
        data,
      } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
      }

      setLoading(false)
    }

    checkUser()

  }, [])

  if (loading) {
    return null
  }

  return children
}