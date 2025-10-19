import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para produtos
const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  stock: z.number().int().min(0, 'Stock deve ser não negativo'),
  images: z.array(z.string()).optional().default([]),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  sku: z.string().min(1, 'SKU é obrigatório'),
  brand: z.string().optional(),
  isActive: z.boolean().default(true)
})

// Função para traduzir do espanhol para português
function translateToPortuguese(text: string): string {
  const translations: { [key: string]: string } = {
    // Categorias
    'Electrodomésticos': 'Eletrodomésticos',
    'Informática': 'Informática',
    'Móviles': 'Telemóveis',
    'Hogar': 'Casa',
    'Deportes': 'Desporto',
    'Moda': 'Moda',
    'Belleza': 'Beleza',
    'Juguetes': 'Brinquedos',
    'Libros': 'Livros',
    'Automoción': 'Automóvel',
    
    // Descrições comuns
    'con tecnología': 'com tecnologia',
    'eficiencia energética': 'eficiência energética',
    'pulgadas': 'polegadas',
    'pantalla': 'ecrã',
    'pantalla táctil': 'ecrã tátil',
    'resolución': 'resolução',
    'memoria RAM': 'memória RAM',
    'almacenamiento': 'armazenamento',
    'procesador': 'processador',
    'sistema operativo': 'sistema operativo',
    'cámara': 'câmara',
    'batería': 'bateria',
    'carga rápida': 'carregamento rápido',
    'inalámbrico': 'sem fios',
    'bluetooth': 'bluetooth',
    'wifi': 'wifi',
    'USB': 'USB',
    'HDMI': 'HDMI',
    'conectividad': 'conectividade',
    'diseño': 'design',
    'ergonómico': 'ergonómico',
    'portátil': 'portátil',
    'compacto': 'compacto',
    'ligero': 'leve',
    'resistente': 'resistente',
    'impermeable': 'impermeável',
    'antideslizante': 'antiderrapante',
    'automático': 'automático',
    'manual': 'manual',
    'digital': 'digital',
    'analógico': 'analógico',
    'inteligente': 'inteligente',
    'smart': 'inteligente',
    'premium': 'premium',
    'profesional': 'profissional',
    'doméstico': 'doméstico',
    'comercial': 'comercial',
    'industrial': 'industrial',
    'de alta calidad': 'de alta qualidade',
    'garantía': 'garantia',
    'garantía de': 'garantia de',
    'años': 'anos',
    'meses': 'meses',
    'días': 'dias',
    'incluye': 'inclui',
    'incluye:': 'inclui:',
    'accesorios': 'acessórios',
    'manual de usuario': 'manual do utilizador',
    'cable': 'cabo',
    'cargador': 'carregador',
    'auriculares': 'auscultadores',
    'estuche': 'estojo',
    'funda': 'capa',
    'protector': 'protetor',
    'soporte': 'suporte',
    'base': 'base',
    'estación': 'estação',
    'estación de carga': 'estação de carregamento',
    'estación de trabajo': 'estação de trabalho',
    'escritorio': 'secretária',
    'mesa': 'mesa',
    'silla': 'cadeira',
    'lámpara': 'lâmpada',
    'iluminación': 'iluminação',
    'LED': 'LED',
    'energía': 'energia',
    'ahorro': 'poupança',
    'ahorro de energía': 'poupança de energia',
    'ecológico': 'ecológico',
    'sostenible': 'sustentável',
    'reciclable': 'reciclável',
    'biodegradable': 'biodegradável',
    'orgánico': 'orgânico',
    'natural': 'natural',
    'artificial': 'artificial',
    'sintético': 'sintético',
    'metálico': 'metálico',
    'plástico': 'plástico',
    'madera': 'madeira',
    'vidrio': 'vidro',
    'cerámica': 'cerâmica',
    'textil': 'têxtil',
    'cuero': 'couro',
    'piel': 'pele',
    'algodón': 'algodão',
    'lino': 'linho',
    'seda': 'seda',
    'lana': 'lã',
    'poliéster': 'poliéster',
    'nylon': 'nylon',
    'elastano': 'elastano',
    'lycra': 'lycra',
    'spandex': 'spandex',
    'microfibra': 'microfibra',
    'terciopelo': 'veludo',
    'satinado': 'acetinado',
    'mate': 'fosco',
    'brillante': 'brilhante',
    'opaco': 'opaco',
    'transparente': 'transparente',
    'translúcido': 'translúcido',
    'color': 'cor',
    'colores': 'cores',
    'multicolor': 'multicolor',
    'unicolor': 'unicolor',
    'blanco': 'branco',
    'negro': 'preto',
    'gris': 'cinza',
    'rojo': 'vermelho',
    'azul': 'azul',
    'verde': 'verde',
    'amarillo': 'amarelo',
    'naranja': 'laranja',
    'rosa': 'rosa',
    'morado': 'roxo',
    'marrón': 'castanho',
    'beige': 'bege',
    'talla': 'tamanho',
    'tallas': 'tamanhos',
    'pequeño': 'pequeno',
    'mediano': 'médio',
    'grande': 'grande',
    'extra grande': 'extra grande',
    'XXL': 'XXL',
    'XL': 'XL',
    'L': 'L',
    'M': 'M',
    'S': 'S',
    'XS': 'XS',
    'XXS': 'XXS',
    'peso': 'peso',
    'kilogramos': 'quilogramas',
    'kg': 'kg',
    'gramos': 'gramas',
    'g': 'g',
    'litros': 'litros',
    'l': 'l',
    'mililitros': 'mililitros',
    'ml': 'ml',
    'centímetros': 'centímetros',
    'cm': 'cm',
    'metros': 'metros',
    'm': 'm',
    'milímetros': 'milímetros',
    'mm': 'mm',
    'pulgadas': 'polegadas',
    'pulg': 'pol',
    'ancho': 'largura',
    'alto': 'altura',
    'profundo': 'profundidade',
    'largo': 'comprimento',
    'diámetro': 'diâmetro',
    'radio': 'raio',
    'volumen': 'volume',
    'capacidad': 'capacidade',
    'velocidad': 'velocidade',
    'potencia': 'potência',
    'voltaje': 'tensão',
    'voltios': 'volts',
    'V': 'V',
    'amperios': 'amperes',
    'A': 'A',
    'vatios': 'watts',
    'W': 'W',
    'kilovatios': 'quilowatts',
    'kW': 'kW',
    'frecuencia': 'frequência',
    'hercios': 'hertz',
    'Hz': 'Hz',
    'megahercios': 'megahertz',
    'MHz': 'MHz',
    'gigahercios': 'gigahertz',
    'GHz': 'GHz',
    'temperatura': 'temperatura',
    'grados': 'graus',
    'celsius': 'celsius',
    '°C': '°C',
    'fahrenheit': 'fahrenheit',
    '°F': '°F',
    'presión': 'pressão',
    'bares': 'bares',
    'bar': 'bar',
    'atmósferas': 'atmosferas',
    'atm': 'atm',
    'pascales': 'pascais',
    'Pa': 'Pa',
    'kilopascales': 'quilopascais',
    'kPa': 'kPa',
    'megapascales': 'megapascais',
    'MPa': 'MPa',
    'humedad': 'humidade',
    'porcentaje': 'percentagem',
    '%': '%',
    'ruido': 'ruído',
    'decibelios': 'decibéis',
    'dB': 'dB',
    'vibración': 'vibração',
    'duración': 'duração',
    'horas': 'horas',
    'h': 'h',
    'minutos': 'minutos',
    'min': 'min',
    'segundos': 'segundos',
    'seg': 'seg',
    's': 's',
    'ciclos': 'ciclos',
    'revoluciones': 'rotações',
    'rpm': 'rpm',
    'revoluciones por minuto': 'rotações por minuto',
    'velocidad de rotación': 'velocidade de rotação',
    'par': 'binário',
    'newton metros': 'newton metros',
    'Nm': 'Nm',
    'kilogramos fuerza': 'quilogramas força',
    'kgf': 'kgf',
    'libras': 'libras',
    'lb': 'lb',
    'onzas': 'onças',
    'oz': 'oz',
    'toneladas': 'toneladas',
    't': 't',
    'kilotones': 'quilotoneladas',
    'kt': 'kt',
    'megatones': 'megatoneladas',
    'Mt': 'Mt',
    'gigatones': 'gigatoneladas',
    'Gt': 'Gt',
    'teratones': 'teratoneladas',
    'Tt': 'Tt',
    'petatones': 'petatoneladas',
    'Pt': 'Pt',
    'exatones': 'exatoneladas',
    'Et': 'Et',
    'zettatones': 'zettatoneladas',
    'Zt': 'Zt',
    'yottatones': 'yottatoneladas',
    'Yt': 'Yt'
  }

  let translatedText = text

  // Aplicar traduções
  Object.entries(translations).forEach(([spanish, portuguese]) => {
    const regex = new RegExp(`\\b${spanish}\\b`, 'gi')
    translatedText = translatedText.replace(regex, portuguese)
  })

  return translatedText
}

// GET - Listar produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const skip = (page - 1) * limit

    const where = {
      isActive: true,
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      skip,
      take: limit
    })

    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Importar produtos do CSV
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { message: 'Arquivo CSV é obrigatório' },
        { status: 400 }
      )
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json(
        { message: 'Arquivo CSV deve ter pelo menos um cabeçalho e uma linha de dados' },
        { status: 400 }
      )
    }

    // Extrair cabeçalhos
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    console.log('Cabeçalhos encontrados:', headers)

    // Mapear cabeçalhos espanhóis para português
    const headerMapping: { [key: string]: string } = {
      'nombre': 'name',
      'descripcion': 'description',
      'precio': 'price',
      'categoria': 'category',
      'stock': 'stock',
      'imagen': 'images',
      'peso': 'weight',
      'dimensiones': 'dimensions',
      'sku': 'sku',
      'marca': 'brand'
    }

    const translatedHeaders = headers.map(header => headerMapping[header] || header)
    console.log('Cabeçalhos traduzidos:', translatedHeaders)

    const products = []
    const errors = []

    // Processar cada linha de dados
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        
        if (values.length !== headers.length) {
          errors.push(`Linha ${i + 1}: Número de colunas incorreto`)
          continue
        }

        // Criar objeto produto
        const productData: any = {}
        
        headers.forEach((header, index) => {
          const translatedHeader = headerMapping[header] || header
          let value = values[index]

          // Traduzir texto se necessário
          if (typeof value === 'string' && (translatedHeader === 'name' || translatedHeader === 'description' || translatedHeader === 'category' || translatedHeader === 'brand')) {
            value = translateToPortuguese(value)
          }

          // Converter tipos
          if (translatedHeader === 'price') {
            value = parseFloat(value.replace(',', '.'))
          } else if (translatedHeader === 'stock') {
            value = parseInt(value)
          } else if (translatedHeader === 'images') {
            value = value ? [value] : []
          }

          productData[translatedHeader] = value
        })

        // Validar dados
        const validatedData = productSchema.parse(productData)
        
        // Verificar se SKU já existe
        const existingProduct = await prisma.product.findUnique({
          where: { sku: validatedData.sku }
        })

        if (existingProduct) {
          // Atualizar produto existente
          await prisma.product.update({
            where: { sku: validatedData.sku },
            data: validatedData
          })
          console.log(`Produto atualizado: ${validatedData.name}`)
        } else {
          // Criar novo produto
          await prisma.product.create({
            data: validatedData
          })
          console.log(`Produto criado: ${validatedData.name}`)
        }

        products.push(validatedData)

      } catch (error) {
        console.error(`Erro na linha ${i + 1}:`, error)
        errors.push(`Linha ${i + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    }

    return NextResponse.json({
      message: 'Importação concluída',
      imported: products.length,
      errors: errors.length,
      errorDetails: errors
    })

  } catch (error) {
    console.error('Erro ao importar produtos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
