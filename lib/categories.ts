// Categorias de serviços disponíveis para profissionais
export const SERVICE_CATEGORIES = [
  {
    id: 'construcao-reforma',
    name: 'Serviços de Construção e Remodelação',
    description: 'Pedreiro, Eletricista, Canalizador, Pintor, Gesseiro, Azulejista, Instalador de Pladur, Marcenaria e móveis sob medida, Carpinteiro',
    icon: '🏗️'
  },
  {
    id: 'servicos-domesticos',
    name: 'Serviços Domésticos',
    description: 'Engomadeira, Cozinheira, Ama (Babysitter), Cuidador de idosos, Lavanderia',
    icon: '🏠'
  },
  {
    id: 'limpeza',
    name: 'Serviços de Limpeza',
    description: 'Limpeza residencial, Comercial/Empresarial, Limpeza pós obras, Vidros, Estofos e carpetes',
    icon: '🧹'
  },
  {
    id: 'tecnologia-informatica',
    name: 'Serviços de Tecnologia e Informática',
    description: 'Suporte técnico, Formatação e manutenção de computadores, Instalação de redes (Wi-Fi, cabeamento), Desenvolvimento de sites, Criação de aplicativos, Marketing digital (tráfego pago, SEO, redes sociais)',
    icon: '💻'
  },
  {
    id: 'automotivos',
    name: 'Serviço Automóvel',
    description: 'Mecânica, Eletricista auto, Chapa e pintura, Mudança de óleo, Serviço de reboque, Higienização interna, Polimento e cristalização, Reparação/Carregamento de ar-condicionado',
    icon: '🚗'
  },
  {
    id: 'beleza-estetica',
    name: 'Beleza e Estética',
    description: 'Cabeleireiro, Maquiador(a), Manicure e pedicure, Unhas de Gel/Gelinho, Massagens relaxamento, Depilação, Designer de sobrancelhas, Esteticista (limpeza de pele, peeling, etc.), Massoterapeuta',
    icon: '💄'
  },
  {
    id: 'saude-bem-estar',
    name: 'Serviços de Saúde e Bem-Estar',
    description: 'Fisioterapia, Nutricionista, Personal trainer, Psicólogo, Terapeuta ocupacional, Acupuntura',
    icon: '💆'
  },
  {
    id: 'transporte-logistica',
    name: 'Serviços de Transporte e Logística',
    description: 'Transporte e mudanças, Serviço de entregas, Transporte executivo, Transporte escolar, Aluguer de viaturas',
    icon: '🚛'
  },
  {
    id: 'educacao',
    name: 'Educação',
    description: 'Aulas particulares (matemática, inglês, etc.), Reforço escolar, Cursos online, Tradução e revisão de textos, Treino corporativo',
    icon: '📚'
  },
  {
    id: 'eventos-festas',
    name: 'Eventos e Festas',
    description: 'Buffet, Empregado de mesa/copeiro, Técnico de som (DJ), Fotógrafo e videomaker, Decoração de festas, Aluguer de mobiliário e equipamentos, Organização de eventos',
    icon: '🎉'
  },
  {
    id: 'administrativos-financeiros',
    name: 'Serviços Administrativos e Financeiros',
    description: 'Consultoria contabilidade, Declaração de IRS, Consultoria jurídica, Planejamento financeiro, Consultoria empresarial, Serviços de RH (recrutamento e seleção)',
    icon: '💼'
  },
  {
    id: 'criativos-design',
    name: 'Serviços Criativos e Design',
    description: 'Design gráfico (logotipos, identidade visual), Criação de conteúdo para redes sociais, Edição de vídeo, Fotografia profissional, Redação publicitária, Ilustração',
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