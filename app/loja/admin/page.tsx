'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react'

export default function AdminLojaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Redirecionar se não for admin
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session || session.user.email !== 'admin@elastiquality.pt') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Acesso Negado
            </h1>
            <p className="text-gray-600">
              Apenas administradores podem acessar esta página.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/loja/produtos', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      setResult({
        message: 'Erro ao fazer upload do arquivo',
        imported: 0,
        errors: 1,
        errorDetails: ['Erro de conexão']
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `nombre,descripcion,precio,categoria,stock,imagen,peso,dimensiones,sku,marca
"Lavadora Samsung","Lavadora de 8kg con tecnología EcoBubble",599.99,"Electrodomésticos",15,"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop","45kg","60x60x85cm","LAV-SAM-001","Samsung"
"Frigorífico Bosch","Frigorífico combi 300L con tecnología NoFrost",899.99,"Electrodomésticos",8,"https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop","65kg","60x66x185cm","FRIG-BOS-002","Bosch"`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'template-produtos.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Administração da Loja
            </h1>
            <p className="text-gray-600">
              Importe produtos do arquivo CSV em espanhol para português de Portugal
            </p>
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">
              Instruções de Importação
            </h2>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p>O arquivo deve estar em formato CSV com codificação UTF-8</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p>Os cabeçalhos podem estar em espanhol - serão traduzidos automaticamente</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p>Colunas obrigatórias: nombre, precio, categoria, stock, sku</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p>Produtos com SKU existente serão atualizados</p>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivo CSV
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Carregar arquivo</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">ou arraste aqui</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    CSV até 10MB
                  </p>
                </div>
              </div>
              {file && (
                <div className="mt-2 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Produtos
                  </>
                )}
              </Button>

              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Template
              </Button>
            </div>
          </div>

          {/* Resultado */}
          {result && (
            <div className={`mt-8 p-6 rounded-lg border ${
              result.errors > 0 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center space-x-2 mb-4">
                {result.errors > 0 ? (
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                <h3 className={`text-lg font-semibold ${
                  result.errors > 0 ? 'text-yellow-900' : 'text-green-900'
                }`}>
                  {result.message}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {result.imported}
                  </div>
                  <div className="text-sm text-gray-600">Produtos Importados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {result.errors}
                  </div>
                  <div className="text-sm text-gray-600">Erros</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.imported + result.errors}
                  </div>
                  <div className="text-sm text-gray-600">Total Processado</div>
                </div>
              </div>

              {result.errorDetails && result.errorDetails.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Detalhes dos Erros:</h4>
                  <div className="bg-white rounded border p-3 max-h-40 overflow-y-auto">
                    {result.errorDetails.map((error: string, index: number) => (
                      <div key={index} className="text-sm text-red-600 py-1">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Formato do CSV */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Formato do Arquivo CSV
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Campo</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Tipo</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Obrigatório</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Exemplo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-900">nombre</td>
                    <td className="px-3 py-2 text-gray-600">Texto</td>
                    <td className="px-3 py-2 text-red-600">Sim</td>
                    <td className="px-3 py-2 text-gray-600">"Lavadora Samsung"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-900">descripcion</td>
                    <td className="px-3 py-2 text-gray-600">Texto</td>
                    <td className="px-3 py-2 text-gray-600">Não</td>
                    <td className="px-3 py-2 text-gray-600">"Lavadora de 8kg"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-900">precio</td>
                    <td className="px-3 py-2 text-gray-600">Número</td>
                    <td className="px-3 py-2 text-red-600">Sim</td>
                    <td className="px-3 py-2 text-gray-600">599.99</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-900">categoria</td>
                    <td className="px-3 py-2 text-gray-600">Texto</td>
                    <td className="px-3 py-2 text-red-600">Sim</td>
                    <td className="px-3 py-2 text-gray-600">"Electrodomésticos"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-900">stock</td>
                    <td className="px-3 py-2 text-gray-600">Número</td>
                    <td className="px-3 py-2 text-red-600">Sim</td>
                    <td className="px-3 py-2 text-gray-600">15</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-900">sku</td>
                    <td className="px-3 py-2 text-gray-600">Texto</td>
                    <td className="px-3 py-2 text-red-600">Sim</td>
                    <td className="px-3 py-2 text-gray-600">"LAV-SAM-001"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-900">imagen</td>
                    <td className="px-3 py-2 text-gray-600">URL</td>
                    <td className="px-3 py-2 text-gray-600">Não</td>
                    <td className="px-3 py-2 text-gray-600">"https://..."</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-900">marca</td>
                    <td className="px-3 py-2 text-gray-600">Texto</td>
                    <td className="px-3 py-2 text-gray-600">Não</td>
                    <td className="px-3 py-2 text-gray-600">"Samsung"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
