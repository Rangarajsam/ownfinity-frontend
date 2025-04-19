'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'

const  RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)
  const loading = useSelector((state: RootState) => state.auth.loading)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (!isClient) return null

  return <>{children}</>
}

export default RequireAuth;