// Estrutura de categorias hierárquica similar à Amazon.es
export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  children?: Category[]
  icon?: string
  description?: string
}

export const storeCategories: Category[] = [
  {
    id: 'eletronica',
    name: 'Eletrónica',
    slug: 'eletronica',
    icon: '📱',
    description: 'Smartphones, tablets, computadores e acessórios',
    children: [
      {
        id: 'smartphones',
        name: 'Smartphones e Acessórios',
        slug: 'smartphones',
        parentId: 'eletronica',
        icon: '📱'
      },
      {
        id: 'computadores',
        name: 'Computadores e Tablets',
        slug: 'computadores',
        parentId: 'eletronica',
        icon: '💻'
      },
      {
        id: 'audio-video',
        name: 'Áudio e Vídeo',
        slug: 'audio-video',
        parentId: 'eletronica',
        icon: '🎵'
      },
      {
        id: 'gaming',
        name: 'Gaming',
        slug: 'gaming',
        parentId: 'eletronica',
        icon: '🎮'
      }
    ]
  },
  {
    id: 'casa-jardim',
    name: 'Casa e Jardim',
    slug: 'casa-jardim',
    icon: '🏠',
    description: 'Decoração, eletrodomésticos e produtos para casa',
    children: [
      {
        id: 'eletrodomesticos',
        name: 'Eletrodomésticos',
        slug: 'eletrodomesticos',
        parentId: 'casa-jardim',
        icon: '🔌'
      },
      {
        id: 'decoration',
        name: 'Decoração',
        slug: 'decoration',
        parentId: 'casa-jardim',
        icon: '🖼️'
      },
      {
        id: 'jardim',
        name: 'Jardim e Exterior',
        slug: 'jardim',
        parentId: 'casa-jardim',
        icon: '🌱'
      }
    ]
  },
  {
    id: 'moda',
    name: 'Moda',
    slug: 'moda',
    icon: '👕',
    description: 'Roupa, calçado e acessórios de moda',
    children: [
      {
        id: 'homem',
        name: 'Homem',
        slug: 'homem',
        parentId: 'moda',
        icon: '👔'
      },
      {
        id: 'mulher',
        name: 'Mulher',
        slug: 'mulher',
        parentId: 'moda',
        icon: '👗'
      },
      {
        id: 'crianca',
        name: 'Criança',
        slug: 'crianca',
        parentId: 'moda',
        icon: '👶'
      }
    ]
  },
  {
    id: 'desporto',
    name: 'Desporto e Lazer',
    slug: 'desporto',
    icon: '⚽',
    description: 'Equipamentos desportivos e atividades ao ar livre',
    children: [
      {
        id: 'fitness',
        name: 'Fitness e Musculação',
        slug: 'fitness',
        parentId: 'desporto',
        icon: '💪'
      },
      {
        id: 'futebol',
        name: 'Futebol',
        slug: 'futebol',
        parentId: 'desporto',
        icon: '⚽'
      },
      {
        id: 'natacao',
        name: 'Natação',
        slug: 'natacao',
        parentId: 'desporto',
        icon: '🏊'
      }
    ]
  },
  {
    id: 'livros',
    name: 'Livros e Media',
    slug: 'livros',
    icon: '📚',
    description: 'Livros, música, filmes e jogos',
    children: [
      {
        id: 'livros-geral',
        name: 'Livros',
        slug: 'livros-geral',
        parentId: 'livros',
        icon: '📖'
      },
      {
        id: 'musica',
        name: 'Música',
        slug: 'musica',
        parentId: 'livros',
        icon: '🎵'
      },
      {
        id: 'filmes',
        name: 'Filmes e Séries',
        slug: 'filmes',
        parentId: 'livros',
        icon: '🎬'
      }
    ]
  },
  {
    id: 'automovel',
    name: 'Automóvel',
    slug: 'automovel',
    icon: '🚗',
    description: 'Peças, acessórios e produtos para automóvel',
    children: [
      {
        id: 'acessorios-carro',
        name: 'Acessórios',
        slug: 'acessorios-carro',
        parentId: 'automovel',
        icon: '🔧'
      },
      {
        id: 'manutencao',
        name: 'Manutenção',
        slug: 'manutencao',
        parentId: 'automovel',
        icon: '🛠️'
      }
    ]
  }
]

// Função para mapear categorias do CSV para categorias da loja
export function mapCsvCategoryToStoreCategory(csvCategory: string): string {
  const categoryMap: { [key: string]: string } = {
    // Eletrónica
    'Gaveta de moedas': 'eletronica',
    'Impressoras de tickets': 'eletronica',
    'Leitores de código de barras': 'eletronica',
    'Terminal Ponto de Venda TPV': 'eletronica',
    'Componentes': 'eletronica',
    'Cables de Seguridad': 'eletronica',
    'Marcos Digitales': 'eletronica',
    'Soportes SmartPhones': 'eletronica',
    'Linternas y Aros de Luz': 'eletronica',
    'Lectores de DNI': 'eletronica',
    'Estaciones meteorologicas': 'casa-jardim',
    'Repuestos para TV': 'eletronica',
    
    // Casa e Jardim
    'Casa y Jardín': 'casa-jardim',
    'Hogar': 'casa-jardim',
    'Decoración': 'casa-jardim',
    
    // Moda
    'Moda': 'moda',
    'Ropa': 'moda',
    'Calzado': 'moda',
    
    // Desporto
    'Deportes': 'desporto',
    'Fitness': 'desporto',
    
    // Livros
    'Libros': 'livros',
    'Música': 'livros',
    'Películas': 'livros',
    
    // Automóvel
    'Automóvil': 'automovel',
    'Coche': 'automovel'
  }

  return categoryMap[csvCategory] || 'eletronica' // Default para eletrónica
}

// Função para obter categoria por slug
export function getCategoryBySlug(slug: string): Category | null {
  function findCategory(categories: Category[]): Category | null {
    for (const category of categories) {
      if (category.slug === slug) return category
      if (category.children) {
        const found = findCategory(category.children)
        if (found) return found
      }
    }
    return null
  }
  
  return findCategory(storeCategories)
}

// Função para obter breadcrumb
export function getBreadcrumb(slug: string): Category[] {
  const breadcrumb: Category[] = []
  
  function findPath(categories: Category[], targetSlug: string, path: Category[] = []): boolean {
    for (const category of categories) {
      const currentPath = [...path, category]
      
      if (category.slug === targetSlug) {
        breadcrumb.push(...currentPath)
        return true
      }
      
      if (category.children && findPath(category.children, targetSlug, currentPath)) {
        return true
      }
    }
    return false
  }
  
  findPath(storeCategories, slug)
  return breadcrumb
}
