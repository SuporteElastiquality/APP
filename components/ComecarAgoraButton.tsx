'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ComecarAgoraButton() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleComecarAgora = () => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
    } else if (session.user.userType === 'CLIENT') {
      router.push('/request-service')
    } else if (session.user.userType === 'PROFESSIONAL') {
      router.push('/search')
    }
  }

  return (
    <button
      onClick={handleComecarAgora}
      className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors"
    >
      Começar Agora
    </button>
  )
}
