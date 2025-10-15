'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Ainda carregando
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.userType === 'CLIENT') {
      router.push('/profile/client')
    } else if (session?.user?.userType === 'PROFESSIONAL') {
      router.push('/profile/professional')
    } else {
      // Se não tem userType definido, redirecionar para completar perfil
      router.push('/auth/google-signup')
    }
  }, [session, status, router])

  // Mostrar loading enquanto redireciona
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para seu perfil...</p>
      </div>
    </div>
  )
}
