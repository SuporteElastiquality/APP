import { Star, Quote, User } from 'lucide-react'

const testimonials = [
  {
    name: 'Maria Silva',
    location: 'Lisboa',
    service: 'Eletricista',
    rating: 5,
    comment: 'Excelente serviço! O profissional foi pontual, competente e resolveu o problema rapidamente. Recomendo!',
    avatar: null
  },
  {
    name: 'João Santos',
    location: 'Porto',
    service: 'Canalizador',
    rating: 5,
    comment: 'Muito satisfeito com o trabalho realizado. Preço justo e qualidade excelente. Voltarei a usar o serviço.',
    avatar: null
  },
  {
    name: 'Ana Costa',
    location: 'Braga',
    service: 'Limpeza',
    rating: 5,
    comment: 'Profissional muito dedicada e atenciosa. Deixou a casa impecável. Super recomendo!',
    avatar: null
  },
  {
    name: 'Pedro Almeida',
    location: 'Coimbra',
    service: 'Jardinagem',
    rating: 5,
    comment: 'Trabalho fantástico! O jardim ficou lindo e o profissional foi muito cuidadoso com as plantas.',
    avatar: null
  },
  {
    name: 'Carla Mendes',
    location: 'Faro',
    service: 'Pintor',
    rating: 5,
    comment: 'Resultado final excedeu as minhas expectativas. Muito profissional e detalhista.',
    avatar: null
  },
  {
    name: 'Ricardo Pereira',
    location: 'Aveiro',
    service: 'Carpinteiro',
    rating: 5,
    comment: 'Serviço de qualidade superior. O móvel ficou exatamente como pedi. Muito obrigado!',
    avatar: null
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            O Que Dizem Nossos Clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Milhares de clientes satisfeitos em todo Portugal confiam na Elastiquality 
            para encontrar os melhores profissionais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <div className="relative mb-4">
                <Quote className="w-8 h-8 text-primary-200 absolute -top-2 -left-2" />
                <p className="text-gray-700 italic pl-6">
                  "{testimonial.comment}"
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-primary-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                  <p className="text-xs text-primary-600">{testimonial.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para encontrar o profissional perfeito?
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Junte-se a milhares de clientes satisfeitos e tenha o seu projeto realizado 
              com qualidade e pontualidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/signup"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cadastrar-se Agora
              </a>
              <a
                href="/services"
                className="inline-flex items-center px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Ver Serviços
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
