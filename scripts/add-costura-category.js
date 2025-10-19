const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addCosturaCategory() {
  try {
    console.log('Adicionando categoria de Costura/Alfaiataria...')

    // Verificar se a categoria já existe
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { id: 'costura-alfaiataria' }
    })

    if (existingCategory) {
      console.log('Categoria já existe!')
    } else {
      // Criar a categoria
      await prisma.serviceCategory.create({
        data: {
          id: 'costura-alfaiataria',
          name: 'Serviços de Costura/Alfaiataria/Modista',
          slug: 'costura-alfaiataria',
          description: 'Fazer bainhas (calças, saias, vestidos), Apertar ou alargar peças (cinturas, laterais, ombros), Encurtar ou alongar mangas, Troca e reparação de fechos (zíperes), Coser ou remendar rasgos e buracos, Troca de forros (em casacos, saias, etc.), Substituição de botões, colchetes e molas, Cerzidos (reparação de pequenos danos em malhas e tecidos)',
          icon: '✂️'
        }
      })
      console.log('✓ Categoria criada com sucesso!')
    }

    // Agora adicionar os serviços
    const services = [
      { name: 'Fazer Bainhas', slug: 'fazer-bainhas', description: 'Bainhas em calças, saias e vestidos' },
      { name: 'Apertar/Alargar Peças', slug: 'apertar-alargar-pecas', description: 'Ajustes em cinturas, laterais e ombros' },
      { name: 'Encurtar/Alongar Mangas', slug: 'encurtar-alongar-mangas', description: 'Ajuste de comprimento de mangas' },
      { name: 'Reparação de Fechos', slug: 'reparacao-fechos', description: 'Troca e reparação de zíperes' },
      { name: 'Remendar Rasgos', slug: 'remendar-rasgos', description: 'Coser e remendar rasgos e buracos' },
      { name: 'Troca de Forros', slug: 'troca-forros', description: 'Substituição de forros em casacos e saias' },
      { name: 'Substituição de Botões', slug: 'substituicao-botoes', description: 'Troca de botões, colchetes e molas' },
      { name: 'Cerzidos', slug: 'cerzidos', description: 'Reparação de pequenos danos em malhas e tecidos' }
    ]

    console.log('Adicionando serviços...')
    for (const service of services) {
      try {
        await prisma.service.create({
          data: {
            ...service,
            categoryId: 'costura-alfaiataria',
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

    console.log('Categoria e serviços de Costura/Alfaiataria adicionados com sucesso!')
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addCosturaCategory()
