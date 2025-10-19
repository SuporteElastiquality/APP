const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkProducts() {
  try {
    const count = await prisma.product.count()
    console.log('📊 Total de produtos na base de dados:', count)
    
    const sampleProducts = await prisma.product.findMany({
      take: 5,
      select: {
        sku: true,
        name: true,
        category: true,
        price: true,
        stock: true,
        brand: true
      }
    })
    
    console.log('\n🔍 Amostra de produtos:')
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   SKU: ${product.sku}`)
      console.log(`   Categoria: ${product.category}`)
      console.log(`   Preço: €${product.price}`)
      console.log(`   Stock: ${product.stock}`)
      console.log(`   Marca: ${product.brand}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()
