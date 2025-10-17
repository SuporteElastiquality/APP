// Categorias de serviços disponíveis para profissionais
export const SERVICE_CATEGORIES = [
  {
    id: 'construcao-reforma',
    name: 'Construção e Reforma',
    description: 'Pedreiro, Eletricista, Encanador, Pintor, Gesseiro, Azulejista, Drywall, Marcenaria',
    icon: '🏗️'
  },
  {
    id: 'servicos-domesticos',
    name: 'Serviços Domésticos',
    description: 'Diarista, Passadeira, Cozinheira, Babá, Cuidador de idosos, Lavanderia',
    icon: '🏠'
  },
  {
    id: 'limpeza',
    name: 'Serviços de Limpeza',
    description: 'Limpeza residencial, pós-obra, comercial, vidros, estofados, caixa d\'água',
    icon: '🧹'
  },
  {
    id: 'tecnologia-informatica',
    name: 'Tecnologia e Informática',
    description: 'Suporte técnico, formatação, redes, desenvolvimento, marketing digital',
    icon: '💻'
  },
  {
    id: 'automotivos',
    name: 'Serviços Automotivos',
    description: 'Mecânico, funilaria, troca de óleo, guincho, higienização, polimento',
    icon: '🚗'
  },
  {
    id: 'beleza-estetica',
    name: 'Beleza e Estética',
    description: 'Cabeleireiro, maquiagem, manicure, depilação, esteticista, massoterapia',
    icon: '💄'
  },
  {
    id: 'saude-bem-estar',
    name: 'Saúde e Bem-estar',
    description: 'Fisioterapia, nutrição, personal trainer, psicologia, acupuntura',
    icon: '💆'
  },
  {
    id: 'transporte-logistica',
    name: 'Transporte e Logística',
    description: 'Frete, mudanças, motoboy, transporte executivo, aluguel de veículos',
    icon: '🚛'
  },
  {
    id: 'educacao',
    name: 'Serviços Educacionais',
    description: 'Aulas particulares, reforço escolar, cursos online, tradução',
    icon: '📚'
  },
  {
    id: 'eventos-festas',
    name: 'Eventos e Festas',
    description: 'Buffet, garçom, DJ, fotografia, decoração, cerimonialista',
    icon: '🎉'
  },
  {
    id: 'administrativos-financeiros',
    name: 'Administrativos e Financeiros',
    description: 'Consultoria contábil, imposto de renda, jurídica, planejamento financeiro',
    icon: '💼'
  },
  {
    id: 'criativos-design',
    name: 'Criativos e Design',
    description: 'Design gráfico, conteúdo digital, edição de vídeo, fotografia, redação',
    icon: '🎨'
  }
] as const

export type ServiceCategoryId = typeof SERVICE_CATEGORIES[number]['id']

// Função para obter categoria por ID
export function getCategoryById(id: string) {
  return SERVICE_CATEGORIES.find(category => category.id === id)
}

// Função para obter todas as categorias
export function getAllCategories() {
  return SERVICE_CATEGORIES
}

// Função para buscar categorias por nome
export function searchCategories(query: string) {
  const lowerQuery = query.toLowerCase()
  return SERVICE_CATEGORIES.filter(category => 
    category.name.toLowerCase().includes(lowerQuery) ||
    category.description.toLowerCase().includes(lowerQuery)
  )
}