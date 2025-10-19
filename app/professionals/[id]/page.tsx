import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MapPin, Star, Clock, Award, CheckCircle, MessageCircle, Phone, Mail, Camera, Briefcase, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Dados mockados - em produção viriam da API
const professionalData = {
  id: 1,
  name: 'João Silva',
  profession: 'Eletricista',
  location: 'Lisboa',
  rating: 4.9,
  reviews: 127,
  experience: '8 anos',
  verified: true,
  specialties: ['Instalações elétricas', 'Reparações', 'Automação', 'Sistemas de segurança'],
  description: 'Eletricista certificado com vasta experiência em instalações residenciais e comerciais. Especializado em automação residencial e sistemas de segurança elétrica.',
  about: 'Sou um eletricista certificado com mais de 8 anos de experiência no mercado. Trabalho com instalações elétricas residenciais e comerciais, sempre priorizando a segurança e qualidade do serviço. Tenho especialização em automação residencial e sistemas de segurança.',
  services: [
    {
      id: 1,
      title: 'Instalação Elétrica Residencial',
      description: 'Instalação completa de sistemas elétricos em residências, incluindo quadros elétricos, tomadas e iluminação.',
      price: '€35/hora',
      duration: '2-3 dias',
      images: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&crop=center'
      ]
    },
    {
      id: 2,
      title: 'Reparação de Sistemas Elétricos',
      description: 'Diagnóstico e reparação de problemas elétricos em instalações existentes.',
      price: '€40/hora',
      duration: '1-2 dias',
      images: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center'
      ]
    },
    {
      id: 3,
      title: 'Automação Residencial',
      description: 'Instalação de sistemas de automação para controlo de iluminação, climatização e segurança.',
      price: '€50/hora',
      duration: '3-5 dias',
      images: [
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&crop=center'
      ]
    }
  ],
  completedJobs: [
    {
      id: 1,
      title: 'Instalação Elétrica - Apartamento T3',
      client: 'Maria Santos',
      rating: 5,
      comment: 'Excelente trabalho! Muito profissional e pontual.',
      date: '2024-01-15',
      images: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center'
      ]
    },
    {
      id: 2,
      title: 'Reparação Sistema Elétrico - Escritório',
      client: 'Carlos Ferreira',
      rating: 5,
      comment: 'Resolveu o problema rapidamente e com qualidade.',
      date: '2024-01-10',
      images: [
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&crop=center'
      ]
    }
  ],
  contact: {
    phone: '+351 912 345 678',
    email: 'joao.silva@email.com'
  }
}

export default function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const professional = professionalData // Em produção, buscar por ID

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-4xl font-bold">
                  {professional.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold">{professional.name.split(' ')[0]}</h1>
                  {professional.verified && (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  )}
                </div>
                
                <p className="text-xl text-secondary-100 mb-4">{professional.profession}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-5 h-5" />
                    <span>{professional.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{professional.rating}</span>
                    <span className="text-secondary-200">({professional.reviews} avaliações)</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="w-5 h-5" />
                    <span>{professional.experience} de experiência</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Link
                  href={`/request-service?professional=${professional.id}&name=${encodeURIComponent(professional.name)}&profession=${encodeURIComponent(professional.profession)}`}
                  className="bg-white text-secondary-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contactar</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Sobre */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{professional.about}</p>
              </div>

              {/* Especialidades */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Especialidades</h3>
                <div className="space-y-2">
                  {professional.specialties.map((specialty, index) => (
                    <span key={index} className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Informação de Contato */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">Como Contactar</h3>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  Para obter informações de contacto e valores detalhados, inicie uma conversa através do botão "Contactar".
                </p>
                <p className="text-xs text-blue-600">
                  O profissional responderá com os dados necessários para o seu projeto.
                </p>
              </div>


            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Serviços */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Serviços Oferecidos</h3>
                <div className="space-y-6">
                  {professional.services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-3">
                        <h4 className="text-lg font-medium text-gray-900">{service.title}</h4>
                        <div className="text-sm text-gray-500 mt-1">{service.duration}</div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                      
                      {service.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {service.images.map((image, index) => (
                            <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                              <Image
                                src={image}
                                alt={service.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trabalhos Realizados */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Trabalhos Realizados</h3>
                <div className="space-y-6">
                  {professional.completedJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-500">Cliente: {job.client}</p>
                          <p className="text-sm text-gray-500">Data: {new Date(job.date).toLocaleDateString('pt-PT')}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{job.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 italic">"{job.comment}"</p>
                      
                      {job.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {job.images.map((image, index) => (
                            <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                              <Image
                                src={image}
                                alt={job.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
