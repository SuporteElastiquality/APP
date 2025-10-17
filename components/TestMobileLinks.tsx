'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestMobileLinks() {
  const [testResults, setTestResults] = useState<string[]>([])

  const testLink = (href: string, name: string) => {
    setTestResults(prev => [...prev, `Testando link: ${name} -> ${href}`])
  }

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Teste de Links Mobile</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => testLink('/services', 'Serviços')}
          className="block w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded"
        >
          Testar Link: Serviços
        </button>
        
        <button
          onClick={() => testLink('/professionals', 'Profissionais')}
          className="block w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded"
        >
          Testar Link: Profissionais
        </button>
        
        <button
          onClick={() => testLink('/how-it-works', 'Como Funciona')}
          className="block w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded"
        >
          Testar Link: Como Funciona
        </button>
        
        <button
          onClick={() => testLink('/about', 'Sobre')}
          className="block w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded"
        >
          Testar Link: Sobre
        </button>
      </div>
      
      <div className="mt-4">
        <h4 className="font-semibold">Resultados:</h4>
        <div className="text-sm space-y-1">
          {testResults.map((result, index) => (
            <div key={index} className="text-gray-600">{result}</div>
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-semibold">Links Reais (Next.js):</h4>
        <div className="space-y-2">
          <Link href="/services" className="block p-2 bg-green-100 hover:bg-green-200 rounded">
            Link Real: Serviços
          </Link>
          <Link href="/professionals" className="block p-2 bg-green-100 hover:bg-green-200 rounded">
            Link Real: Profissionais
          </Link>
          <Link href="/how-it-works" className="block p-2 bg-green-100 hover:bg-green-200 rounded">
            Link Real: Como Funciona
          </Link>
          <Link href="/about" className="block p-2 bg-green-100 hover:bg-green-200 rounded">
            Link Real: Sobre
          </Link>
        </div>
      </div>
    </div>
  )
}
