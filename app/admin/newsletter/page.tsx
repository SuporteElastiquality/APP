'use client'

import { useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'

export default function NewsletterAdmin() {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    targetUsers: 'ALL'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin_secret_key_123'}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Erro ao enviar newsletter' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            📰 Painel de Newsletter
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Assunto do Email"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Ex: Novidades do Elastiquality"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Público Alvo
              </label>
              <select
                value={formData.targetUsers}
                onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Todos os usuários</option>
                <option value="CLIENTS">Apenas Clientes</option>
                <option value="PROFESSIONALS">Apenas Profissionais</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo do Email
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Digite o conteúdo da newsletter aqui..."
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Enviando...' : 'Enviar Newsletter'}
            </Button>
          </form>

          {result && (
            <div className="mt-8 p-4 rounded-md bg-gray-100">
              <h3 className="font-semibold mb-2">Resultado:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Dicas:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use HTML no conteúdo para formatação</li>
              <li>• Teste primeiro com um grupo pequeno</li>
              <li>• O nome do usuário será inserido automaticamente</li>
              <li>• Links serão automaticamente clicáveis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
