const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Função para limpar e converter HTML para texto limpo
function cleanHtmlToText(html) {
  if (!html) return ''
  
  // Remover quebras de linha e espaços extras
  let text = html.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  
  // Remover tags HTML mas manter o conteúdo
  text = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<\/li>/gi, '\n• ')
    .replace(/<li[^>]*>/gi, '')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<h[1-6][^>]*>/gi, '\n')
    .replace(/<strong[^>]*>/gi, '**')
    .replace(/<\/strong>/gi, '**')
    .replace(/<b[^>]*>/gi, '**')
    .replace(/<\/b>/gi, '**')
    .replace(/<em[^>]*>/gi, '*')
    .replace(/<\/em>/gi, '*')
    .replace(/<i[^>]*>/gi, '*')
    .replace(/<\/i>/gi, '*')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/<[^>]*>/g, '') // Remover qualquer tag HTML restante
  
  // Limpar espaços extras e quebras de linha
  text = text.replace(/\n\s*\n/g, '\n\n').replace(/\s+/g, ' ').trim()
  
  return text
}

// Função para traduzir do espanhol para português
function translateToPortuguese(text) {
  const translations = {
    // Categorias
    'Cajon portamonedas': 'Gaveta de moedas',
    'Impresoras tickets': 'Impressoras de tickets',
    'Lectores codigos barra': 'Leitores de código de barras',
    'Terminal Pto Venta TPV': 'Terminal Ponto de Venda TPV',
    'Componentes': 'Componentes',
    
    // Termos técnicos
    'Especificaciones': 'Especificações',
    'Cajón portamonedas': 'Gaveta de moedas',
    'Compartimentos de monedas y billetes': 'Compartimentos de moedas e notas',
    'ajustables': 'ajustáveis',
    'Extraíbles': 'Extraíveis',
    'Tipo gaveta Fija': 'Tipo gaveta fixa',
    'Ranura frontal': 'Ranhura frontal',
    'transacciones sin efectivo': 'transações sem dinheiro',
    'grandes billetes': 'notas grandes',
    'Cerradura de tres posiciones': 'Fechadura de três posições',
    'Apertura electrónica': 'Abertura eletrónica',
    'apertura manual': 'abertura manual',
    'bloqueo': 'bloqueio',
    'Color negro': 'Cor preto',
    'Dimensiones': 'Dimensões',
    'Anchura': 'Largura',
    'Fondo': 'Profundidade',
    'Interface': 'Interface',
    'Microswitch': 'Microswitch',
    'Separadores billetes': 'Separadores de notas',
    'Separadores monedas': 'Separadores de moedas',
    'Tipo de apertura': 'Tipo de abertura',
    'Longitud Cable': 'Comprimento do cabo',
    'Peso': 'Peso',
    'Voltaje': 'Tensão',
    'Impresora de tickets': 'Impressora de tickets',
    'térmica': 'térmica',
    'Ancho papel': 'Largura do papel',
    'USB-RS232-Ethernet-RJ11': 'USB-RS232-Ethernet-RJ11',
    'Negra': 'Preta',
    'autocorte': 'corte automático',
    'señal acústica': 'sinal acústico',
    'fin de impresión': 'fim de impressão',
    'velocidad': 'velocidade',
    'buffer': 'buffer',
    'resolución': 'resolução',
    'calidad': 'qualidade',
    'rapidez': 'rapidez',
    'comunicaciones': 'comunicações',
    'cuadruple interface': 'interface quádrupla',
    'puerto de apertura': 'porta de abertura',
    'cajón': 'gaveta',
    'Compatible con impresión': 'Compatível com impressão',
    'códigos de barras': 'códigos de barras',
    'fuente de alimentación': 'fonte de alimentação',
    'cable USB': 'cabo USB',
    'cable RS232': 'cabo RS232',
    'rollo de papel': 'rolo de papel',
    'térmico': 'térmico',
    'Prestaciones': 'Prestações',
    'Soporte impresión': 'Suporte de impressão',
    'Ticket': 'Ticket',
    'Tecnología': 'Tecnologia',
    'Térmica directa': 'Térmica direta',
    'Velocidad': 'Velocidade',
    'Resolución': 'Resolução',
    'Ancho': 'Largura',
    'Corte Automático': 'Corte Automático',
    'Rebobinador': 'Rebobinador',
    'Despegador': 'Descolador',
    'Peeler': 'Descolador',
    'Banda Magnética': 'Banda Magnética',
    'Smart Card': 'Smart Card',
    'RFID': 'RFID',
    'Instalación': 'Instalação',
    'Ubicación': 'Localização',
    'Sobremesa': 'Sobremesa',
    'Montaje en pared': 'Montagem na parede',
    'Especificaciones': 'Especificações',
    'Impresión': 'Impressão',
    'Térmica directa': 'Térmica direta',
    'Ancho Impresión': 'Largura de Impressão',
    'Corte': 'Corte',
    'Automático': 'Automático',
    'Interfaz': 'Interface',
    'Ethernet': 'Ethernet',
    'RJ11': 'RJ11',
    'cajon portamonedas': 'gaveta de moedas',
    'Buffer': 'Buffer',
    'Señal acústica': 'Sinal acústico',
    'Sí': 'Sim',
    'fin de impresión': 'fim de impressão',
    'NV Flash': 'NV Flash',
    'Alimentación': 'Alimentação',
    'Fuente de alimentación externa': 'Fonte de alimentação externa',
    'Peso Neto': 'Peso Líquido',
    'Tamaño': 'Tamanho',
    'ancho x fondo x alto': 'largura x profundidade x altura',
    'Temperatura de trabajo': 'Temperatura de trabalho',
    'Humedad': 'Humidade',
    'Temperatura almacén': 'Temperatura de armazém',
    'Vida mecanismo': 'Vida do mecanismo',
    'Vida corte': 'Vida do corte',
    'millones de cortes': 'milhões de cortes',
    'Contenido de caja': 'Conteúdo da caixa',
    'Impresora': 'Impressora',
    'cable DC': 'cabo DC',
    'rollo de papel de 80mm': 'rolo de papel de 80mm',
    'cortesía': 'cortesia',
    'Lector de código de barras': 'Leitor de código de barras',
    'Imager 2D': 'Imager 2D',
    'capaz de leer': 'capaz de ler',
    'todos los tipos': 'todos os tipos',
    'código 1D': 'código 1D',
    'código 2D': 'código 2D',
    'estándar del mercado': 'padrão do mercado',
    'precio muy competitivo': 'preço muito competitivo',
    'Carcasa con diseño': 'Carcaça com design',
    'ergonómico': 'ergonómico',
    'uso continuo': 'uso contínuo',
    'scanner': 'scanner',
    'auto discriminación': 'auto discriminação',
    'alta capacidad': 'alta capacidade',
    'decodificación': 'decodificação',
    'lectura': 'leitura',
    'reducido consumo': 'consumo reduzido',
    'energía': 'energia',
    'modo de lectura automática': 'modo de leitura automática',
    'programación': 'programação',
    'muy sencilla': 'muito simples',
    'códigos de barras incluidos': 'códigos de barras incluídos',
    'manual': 'manual',
    'Soporte incluido': 'Suporte incluído',
    'Aplicaciones': 'Aplicações',
    'Lectura de códigos': 'Leitura de códigos',
    'De mano': 'De mão',
    'Tipo de escaneado': 'Tipo de digitalização',
    'Lineal': 'Linear',
    'Características técnicas': 'Características técnicas',
    'Tecnología': 'Tecnologia',
    'Soporte/Stand': 'Suporte/Stand',
    'Incluido': 'Incluído',
    'Características': 'Características',
    'Imager CMOS 2D': 'Imager CMOS 2D',
    'Mecanismo Resolución': 'Mecanismo de Resolução',
    'Aimer Led Blanco': 'Aimer LED Branco',
    'Fuente de luz': 'Fonte de luz',
    'Método de uso': 'Método de uso',
    'Manual o sobremesa': 'Manual ou sobremesa',
    'Lectura automática': 'Leitura automática',
    'pulsador': 'botão',
    'Simbologías': 'Simbologias',
    'EAN': 'EAN',
    'UPC': 'UPC',
    'Code 39': 'Code 39',
    'Code 93': 'Code 93',
    'Code 128': 'Code 128',
    'Codabar': 'Codabar',
    'UCC/EAN-128': 'UCC/EAN-128',
    'Interleaved 2 of 5': 'Interleaved 2 of 5',
    'ITF-6': 'ITF-6',
    'ITF-14': 'ITF-14',
    'ISBN': 'ISBN',
    'ISSN': 'ISSN',
    'MSI-Plessey': 'MSI-Plessey',
    'GS1 DataBar': 'GS1 DataBar',
    'GS1 Composite Code': 'GS1 Composite Code',
    'Code 11': 'Code 11',
    'Industrial 25': 'Industrial 25',
    'Standard 25': 'Standard 25',
    'Plessey': 'Plessey',
    'Matrix 2 of 5': 'Matrix 2 of 5',
    'QR Code': 'QR Code',
    'Data Matrix': 'Data Matrix',
    'PDF417': 'PDF417',
    'Micor PDF417': 'Micro PDF417',
    'Aztec': 'Aztec',
    'Hanxin': 'Hanxin',
    'Resistencia': 'Resistência',
    'Soporta caídas': 'Suporta quedas',
    'cable': 'cabo',
    'Color': 'Cor',
    'Negro': 'Preto',
    'Soporte': 'Suporte',
    'Peso': 'Peso',
    'sin soporte': 'sem suporte',
    'Medidas': 'Medidas',
    'Consumo': 'Consumo',
    'Stand By': 'Stand By'
  }

  let translatedText = text

  Object.entries(translations).forEach(([spanish, portuguese]) => {
    const regex = new RegExp(`\\b${spanish}\\b`, 'gi')
    translatedText = translatedText.replace(regex, portuguese)
  })

  return translatedText
}

async function importProductsV2() {
  try {
    console.log('🚀 Iniciando importação de produtos v2...')
    
    // Ler arquivo CSV
    const csvPath = path.join(__dirname, '..', 'data', 'produtos.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    console.log(`📄 Arquivo lido: ${lines.length} linhas`)
    
    if (lines.length < 2) {
      throw new Error('Arquivo CSV deve ter pelo menos um cabeçalho e uma linha de dados')
    }

    // Extrair cabeçalhos (usar ; como separador)
    const headers = lines[0].split(';').map(h => h.trim().replace(/"/g, ''))
    console.log('📋 Cabeçalhos encontrados:', headers)

    // Mapear cabeçalhos espanhóis para português
    const headerMapping = {
      'Codigo': 'sku',
      'Nombre': 'name',
      'Caracteristicas': 'description',
      'Familia Ventas': 'category',
      'Stock': 'stock',
      'Imagen1': 'images',
      'Fabricante': 'brand',
      'Peso': 'weight',
      'Alto': 'alto',
      'Ancho': 'ancho',
      'Fondo': 'fondo',
      'Precio Margen sin IVA': 'price'
    }

    const translatedHeaders = headers.map(header => headerMapping[header] || header)
    console.log('🔄 Cabeçalhos traduzidos:', translatedHeaders)

    let imported = 0
    let updated = 0
    let errors = 0
    const errorDetails = []

    // Processar cada linha de dados
    for (let i = 1; i < lines.length; i++) {
      try {
        if (i % 1000 === 0) {
          console.log(`⏳ Processando linha ${i}/${lines.length - 1}...`)
        }

        const values = lines[i].split(';').map(v => v.trim().replace(/"/g, ''))
        
        if (values.length !== headers.length) {
          errorDetails.push(`Linha ${i + 1}: Número de colunas incorreto`)
          errors++
          continue
        }

        // Criar objeto produto apenas com campos necessários
        const productData = {}
        
        headers.forEach((header, index) => {
          const translatedHeader = headerMapping[header]
          if (!translatedHeader) return // Pular campos não mapeados
          
          let value = values[index]

          // Processar descrição (limpar HTML e traduzir)
          if (translatedHeader === 'description') {
            value = cleanHtmlToText(value)
            value = translateToPortuguese(value)
          }
          // Traduzir outros campos de texto
          else if (typeof value === 'string' && (translatedHeader === 'name' || translatedHeader === 'category' || translatedHeader === 'brand')) {
            value = translateToPortuguese(value)
          }
          // Converter tipos
          else if (translatedHeader === 'price') {
            value = parseFloat(value.replace(',', '.'))
          } else if (translatedHeader === 'stock') {
            value = parseInt(value)
          } else if (translatedHeader === 'images') {
            value = value ? [value] : []
          } else if (translatedHeader === 'weight') {
            // Converter peso para string com kg
            value = value ? `${value}kg` : null
          }

          productData[translatedHeader] = value
        })

        // Criar dimensões a partir dos campos Alto, Ancho, Fondo
        const alto = values[headers.indexOf('Alto')] || ''
        const ancho = values[headers.indexOf('Ancho')] || ''
        const fondo = values[headers.indexOf('Fondo')] || ''
        if (alto && ancho && fondo) {
          productData.dimensions = `${ancho}x${fondo}x${alto}mm`
        }
        
        // Remover campos que não existem no modelo Prisma
        delete productData.alto
        delete productData.ancho
        delete productData.fondo

        // Adicionar campos obrigatórios
        productData.isActive = productData.stock > 0

        // Verificar se SKU já existe
        const existingProduct = await prisma.product.findUnique({
          where: { sku: productData.sku }
        })

        if (existingProduct) {
          // Atualizar produto existente
          await prisma.product.update({
            where: { sku: productData.sku },
            data: productData
          })
          updated++
        } else {
          // Criar novo produto
          await prisma.product.create({
            data: productData
          })
          imported++
        }

      } catch (error) {
        console.error(`❌ Erro na linha ${i + 1}:`, error.message)
        errorDetails.push(`Linha ${i + 1}: ${error.message}`)
        errors++
      }
    }

    console.log('\n✅ Importação v2 concluída!')
    console.log(`📊 Estatísticas:`)
    console.log(`   • Produtos importados: ${imported}`)
    console.log(`   • Produtos atualizados: ${updated}`)
    console.log(`   • Erros: ${errors}`)
    console.log(`   • Total processado: ${imported + updated + errors}`)

    if (errorDetails.length > 0) {
      console.log('\n❌ Detalhes dos erros:')
      errorDetails.slice(0, 10).forEach(error => console.log(`   • ${error}`))
      if (errorDetails.length > 10) {
        console.log(`   • ... e mais ${errorDetails.length - 10} erros`)
      }
    }

  } catch (error) {
    console.error('💥 Erro na importação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importProductsV2()
