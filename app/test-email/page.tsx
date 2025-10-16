'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'

export default function TestEmailPage() {
  const { data: session } = useSession()
  const [email, setEmail] = useState('jdterra@outlook.com')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testEmail = async () => {
    if (!email) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ 
        status: 'error', 
        data: { error: error instanceof Error ? error.message : 'Erro desconhecido' }
      })
    } finally {
      setLoading(false)
    }
  }

  const testForgotPassword = async () => {
    if (!email) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ 
        status: 'error', 
        data: { error: error instanceof Error ? error.message : 'Erro desconhecido' }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Teste de Email</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email para teste
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o email para teste"
                className="w-full"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={testEmail}
                disabled={loading || !email}
                className="px-6"
              >
                {loading ? 'Testando...' : 'Testar Email Direto'}
              </Button>

              <Button
                onClick={testForgotPassword}
                disabled={loading || !email}
                className="px-6 bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Testando...' : 'Testar Recuperação de Senha'}
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Resultado do Teste:
                </h3>
                <div className="space-y-2">
                  <p><strong>Status:</strong> {result.status}</p>
                  <pre className="bg-white p-3 rounded border text-sm overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Instruções:
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>• <strong>Testar Email Direto:</strong> Testa o endpoint /api/test-email</li>
                <li>• <strong>Testar Recuperação de Senha:</strong> Testa o endpoint /api/auth/forgot-password</li>
                <li>• Verifique sua caixa de entrada após o teste</li>
                <li>• Verifique também a pasta de spam/lixo eletrônico</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
