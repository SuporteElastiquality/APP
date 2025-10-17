import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Baixe o App Elastiquality
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Tenha acesso a milhares de profissionais na palma da sua mão. 
            Disponível para iOS e Android.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download para iOS
            </a>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download para Android
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
