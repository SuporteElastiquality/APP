const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const servicesData = {
  'construcao-reforma': [
    { name: 'Pedreiro', slug: 'pedreiro', description: 'Construção e reparação de alvenaria' },
    { name: 'Eletricista', slug: 'eletricista', description: 'Instalações elétricas e reparações' },
    { name: 'Canalizador', slug: 'canalizador', description: 'Reparações de canalizações' },
    { name: 'Pintor', slug: 'pintor', description: 'Pintura de interiores e exteriores' },
    { name: 'Gesseiro', slug: 'gesseiro', description: 'Instalação e reparação de gesso' },
    { name: 'Azulejista', slug: 'azulejista', description: 'Colocação e reparação de azulejos' },
    { name: 'Instalador de Pladur', slug: 'instalador-pladur', description: 'Instalação de paredes de pladur' },
    { name: 'Marcenaria', slug: 'marcenaria', description: 'Móveis sob medida e reparações' },
    { name: 'Carpinteiro', slug: 'carpinteiro', description: 'Trabalhos em madeira' }
  ],
  'servicos-domesticos': [
    { name: 'Engomadeira', slug: 'engomadeira', description: 'Serviços de engomaria' },
    { name: 'Cozinheira', slug: 'cozinheira', description: 'Preparação de refeições' },
    { name: 'Ama (Babysitter)', slug: 'ama-babysitter', description: 'Cuidado de crianças' },
    { name: 'Cuidador de idosos', slug: 'cuidador-idosos', description: 'Assistência a idosos' },
    { name: 'Lavanderia', slug: 'lavanderia', description: 'Serviços de lavanderia' }
  ],
  'limpeza': [
    { name: 'Limpeza Residencial', slug: 'limpeza-residencial', description: 'Limpeza de casas e apartamentos' },
    { name: 'Limpeza Pós-obra', slug: 'limpeza-pos-obra', description: 'Limpeza após construção' },
    { name: 'Limpeza Comercial', slug: 'limpeza-comercial', description: 'Limpeza de escritórios e lojas' },
    { name: 'Limpeza de Vidros', slug: 'limpeza-vidros', description: 'Limpeza especializada de vidros' },
    { name: 'Limpeza de Estofos', slug: 'limpeza-estofos', description: 'Limpeza de sofás e cadeiras' }
  ],
  'tecnologia-informatica': [
    { name: 'Suporte Técnico', slug: 'suporte-tecnico', description: 'Assistência técnica em informática' },
    { name: 'Formatação de Computadores', slug: 'formatacao-computadores', description: 'Formatação e manutenção' },
    { name: 'Instalação de Redes', slug: 'instalacao-redes', description: 'Wi-Fi e cabeamento' },
    { name: 'Desenvolvimento de Sites', slug: 'desenvolvimento-sites', description: 'Criação de websites' },
    { name: 'Criação de Aplicativos', slug: 'criacao-aplicativos', description: 'Desenvolvimento de apps' },
    { name: 'Marketing Digital', slug: 'marketing-digital', description: 'SEO e redes sociais' }
  ],
  'automotivos': [
    { name: 'Mecânica', slug: 'mecanica', description: 'Reparações automóveis' },
    { name: 'Eletricista Auto', slug: 'eletricista-auto', description: 'Sistemas elétricos automóveis' },
    { name: 'Chapa e Pintura', slug: 'chapa-pintura', description: 'Reparação de carroçaria' },
    { name: 'Mudança de Óleo', slug: 'mudanca-oleo', description: 'Serviços de manutenção' },
    { name: 'Serviço de Reboque', slug: 'servico-reboque', description: 'Reboque e assistência' },
    { name: 'Higienização Interna', slug: 'higienizacao-interna', description: 'Limpeza automóvel' }
  ],
  'beleza-estetica': [
    { name: 'Cabeleireiro', slug: 'cabeleireiro', description: 'Cortes e penteados' },
    { name: 'Maquiador(a)', slug: 'maquiador', description: 'Maquilhagem profissional' },
    { name: 'Manicure e Pedicure', slug: 'manicure-pedicure', description: 'Cuidados das unhas' },
    { name: 'Unhas de Gel', slug: 'unhas-gel', description: 'Aplicação de gel' },
    { name: 'Massagens', slug: 'massagens', description: 'Massagens relaxamento' },
    { name: 'Depilação', slug: 'depilacao', description: 'Serviços de depilação' }
  ],
  'saude-bem-estar': [
    { name: 'Fisioterapia', slug: 'fisioterapia', description: 'Tratamentos fisioterapêuticos' },
    { name: 'Nutricionista', slug: 'nutricionista', description: 'Consultoria nutricional' },
    { name: 'Personal Trainer', slug: 'personal-trainer', description: 'Treino personalizado' },
    { name: 'Psicólogo', slug: 'psicologo', description: 'Acompanhamento psicológico' },
    { name: 'Acupuntura', slug: 'acupuntura', description: 'Tratamentos de acupuntura' }
  ],
  'transporte-logistica': [
    { name: 'Transporte e Mudanças', slug: 'transporte-mudancas', description: 'Serviços de mudança' },
    { name: 'Serviço de Entregas', slug: 'servico-entregas', description: 'Entregas rápidas' },
    { name: 'Transporte Executivo', slug: 'transporte-executivo', description: 'Transporte de executivos' },
    { name: 'Transporte Escolar', slug: 'transporte-escolar', description: 'Transporte de crianças' },
    { name: 'Aluguer de Viaturas', slug: 'aluguer-viaturas', description: 'Aluguer de veículos' }
  ],
  'educacao': [
    { name: 'Aulas Particulares', slug: 'aulas-particulares', description: 'Matemática, inglês, etc.' },
    { name: 'Reforço Escolar', slug: 'reforco-escolar', description: 'Apoio ao estudo' },
    { name: 'Tradução', slug: 'traducao', description: 'Serviços de tradução' }
  ],
  'eventos-festas': [
    { name: 'Buffet', slug: 'buffet', description: 'Serviços de catering' },
    { name: 'Empregado de Mesa', slug: 'empregado-mesa', description: 'Serviço de mesa' },
    { name: 'DJ', slug: 'dj', description: 'Serviços de som' },
    { name: 'Fotógrafo', slug: 'fotografo', description: 'Fotografia de eventos' },
    { name: 'Decoração de Festas', slug: 'decoracao-festas', description: 'Decoração de eventos' }
  ],
  'administrativos-financeiros': [
    { name: 'Consultoria Contábil', slug: 'consultoria-contabil', description: 'Serviços contabilísticos' },
    { name: 'Declaração de IRS', slug: 'declaracao-irs', description: 'Preparação de IRS' },
    { name: 'Consultoria Jurídica', slug: 'consultoria-juridica', description: 'Aconselhamento legal' },
    { name: 'Planejamento Financeiro', slug: 'planejamento-financeiro', description: 'Gestão financeira' },
    { name: 'Recursos Humanos', slug: 'recursos-humanos', description: 'Serviços de RH' }
  ],
  'criativos-design': [
    { name: 'Design Gráfico', slug: 'design-grafico', description: 'Logotipos e identidade visual' },
    { name: 'Criação de Conteúdo', slug: 'criacao-conteudo', description: 'Conteúdo para redes sociais' },
    { name: 'Edição de Vídeo', slug: 'edicao-video', description: 'Produção e edição' },
    { name: 'Fotografia Profissional', slug: 'fotografia-profissional', description: 'Sessões fotográficas' },
    { name: 'Redação Publicitária', slug: 'redacao-publicitaria', description: 'Textos publicitários' }
  ]
}

async function populateServices() {
  try {
    console.log('Iniciando população de serviços...')

    // Primeiro, vamos verificar se as categorias existem
    const categories = await prisma.serviceCategory.findMany()
    console.log(`Encontradas ${categories.length} categorias`)

    if (categories.length === 0) {
      console.log('Nenhuma categoria encontrada. Criando categorias primeiro...')
      
      // Criar categorias
      const categoryData = [
        { id: 'construcao-reforma', name: 'Serviços de Construção e Remodelação', slug: 'construcao-reforma', description: 'Pedreiro, Eletricista, Canalizador, Pintor, Gesseiro, Azulejista, Instalador de Pladur, Marcenaria e móveis sob medida, Carpinteiro', icon: '🏗️' },
        { id: 'servicos-domesticos', name: 'Serviços Domésticos', slug: 'servicos-domesticos', description: 'Engomadeira, Cozinheira, Ama (Babysitter), Cuidador de idosos, Lavanderia', icon: '🏠' },
        { id: 'limpeza', name: 'Serviços de Limpeza', slug: 'limpeza', description: 'Limpeza residencial, Comercial/Empresarial, Limpeza pós obras, Vidros, Estofos e carpetes', icon: '🧹' },
        { id: 'tecnologia-informatica', name: 'Serviços de Tecnologia e Informática', slug: 'tecnologia-informatica', description: 'Suporte técnico, Formatação e manutenção de computadores, Instalação de redes (Wi-Fi, cabeamento), Desenvolvimento de sites, Criação de aplicativos, Marketing digital (tráfego pago, SEO, redes sociais)', icon: '💻' },
        { id: 'automotivos', name: 'Serviço Automóvel', slug: 'automotivos', description: 'Mecânica, Eletricista auto, Chapa e pintura, Mudança de óleo, Serviço de reboque, Higienização interna, Polimento e cristalização, Reparação/Carregamento de ar-condicionado', icon: '🚗' },
        { id: 'beleza-estetica', name: 'Beleza e Estética', slug: 'beleza-estetica', description: 'Cabeleireiro, Maquiador(a), Manicure e pedicure, Unhas de Gel/Gelinho, Massagens relaxamento, Depilação, Designer de sobrancelhas, Esteticista (limpeza de pele, peeling, etc.), Massoterapeuta', icon: '💄' },
        { id: 'saude-bem-estar', name: 'Serviços de Saúde e Bem-Estar', slug: 'saude-bem-estar', description: 'Fisioterapia, Nutricionista, Personal trainer, Psicólogo, Terapeuta ocupacional, Acupuntura', icon: '💆' },
        { id: 'transporte-logistica', name: 'Serviços de Transporte e Logística', slug: 'transporte-logistica', description: 'Transporte e mudanças, Serviço de entregas, Transporte executivo, Transporte escolar, Aluguer de viaturas', icon: '🚛' },
        { id: 'educacao', name: 'Educação', slug: 'educacao', description: 'Aulas particulares (matemática, inglês, etc.), Reforço escolar, Tradução e revisão de textos', icon: '📚' },
        { id: 'eventos-festas', name: 'Eventos e Festas', slug: 'eventos-festas', description: 'Buffet, Empregado de mesa/copeiro, Técnico de som (DJ), Fotógrafo e videomaker, Decoração de festas, Aluguer de mobiliário e equipamentos, Organização de eventos', icon: '🎉' },
        { id: 'administrativos-financeiros', name: 'Serviços Administrativos e Financeiros', slug: 'administrativos-financeiros', description: 'Consultoria contabilidade, Declaração de IRS, Consultoria jurídica, Planejamento financeiro, Consultoria empresarial, Serviços de RH (recrutamento e seleção)', icon: '💼' },
        { id: 'criativos-design', name: 'Serviços Criativos e Design', slug: 'criativos-design', description: 'Design gráfico (logotipos, identidade visual), Criação de conteúdo para redes sociais, Edição de vídeo, Fotografia profissional, Redação publicitária, Ilustração', icon: '🎨' }
      ]

      for (const category of categoryData) {
        await prisma.serviceCategory.create({
          data: category
        })
        console.log(`Categoria criada: ${category.name}`)
      }
    }

    // Agora criar os serviços
    for (const [categorySlug, services] of Object.entries(servicesData)) {
      const category = await prisma.serviceCategory.findUnique({
        where: { slug: categorySlug }
      })

      if (!category) {
        console.log(`Categoria não encontrada: ${categorySlug}`)
        continue
      }

      console.log(`Criando serviços para categoria: ${category.name}`)

      for (const service of services) {
        try {
          await prisma.service.create({
            data: {
              ...service,
              categoryId: category.id,
              isActive: true
            }
          })
          console.log(`  ✓ ${service.name}`)
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`  - ${service.name} já existe`)
          } else {
            console.error(`  ✗ Erro ao criar ${service.name}:`, error.message)
          }
        }
      }
    }

    console.log('População de serviços concluída!')
  } catch (error) {
    console.error('Erro ao popular serviços:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateServices()
