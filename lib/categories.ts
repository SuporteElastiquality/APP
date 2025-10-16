// Categorias de serviços disponíveis para profissionais
export const SERVICE_CATEGORIES = [
  {
    id: 'construcao',
    name: 'Construção e Obras',
    description: 'Construção, demolição, reformas e obras gerais',
    icon: '🏗️'
  },
  {
    id: 'reparacoes',
    name: 'Reparações e Manutenção',
    description: 'Reparações elétricas, canalizações, eletrodomésticos',
    icon: '🔧'
  },
  {
    id: 'servicos-domesticos',
    name: 'Serviços Domésticos',
    description: 'Limpeza, jardinagem, mudanças, organização',
    icon: '🏠'
  },
  {
    id: 'automovel',
    name: 'Automóvel e Transporte',
    description: 'Mecânica, pneus, lavagem, transporte',
    icon: '🚗'
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia e Informática',
    description: 'Informática, redes, eletrônicos, software',
    icon: '💻'
  },
  {
    id: 'saude-bem-estar',
    name: 'Saúde e Bem-estar',
    description: 'Fisioterapia, massagens, cuidados pessoais',
    icon: '💆'
  },
  {
    id: 'educacao',
    name: 'Educação e Formação',
    description: 'Explicações, cursos, formação profissional',
    icon: '📚'
  },
  {
    id: 'eventos',
    name: 'Eventos e Catering',
    description: 'Organização de eventos, catering, decoração',
    icon: '🎉'
  },
  {
    id: 'fotografia-video',
    name: 'Fotografia e Vídeo',
    description: 'Fotografia, vídeo, edição, drones',
    icon: '📸'
  },
  {
    id: 'design-marketing',
    name: 'Design e Marketing',
    description: 'Design gráfico, web design, marketing digital',
    icon: '🎨'
  },
  {
    id: 'consultoria',
    name: 'Consultoria e Serviços Profissionais',
    description: 'Consultoria empresarial, jurídica, financeira',
    icon: '💼'
  },
  {
    id: 'outros',
    name: 'Outros Serviços',
    description: 'Outros serviços não categorizados',
    icon: '⚙️'
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
