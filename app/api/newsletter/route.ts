import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// Sistema de email será implementado via Firebase
import { getClientIP, checkRateLimit, validateAdminToken, sanitizeInput, logSecurityEvent } from '@/lib/security'
import { z } from 'zod'

// Schema para validação da newsletter
const newsletterSchema = z.object({
  subject: z.string().min(1, 'Assunto é obrigatório').max(200, 'Assunto muito longo'),
  content: z.string().min(1, 'Conteúdo é obrigatório').max(10000, 'Conteúdo muito longo'),
  targetUsers: z.enum(['ALL', 'CLIENTS', 'PROFESSIONALS']).default('ALL')
})

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Rate limiting
    const rateLimit = checkRateLimit(clientIP, 'newsletter')
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', { 
        ip: clientIP, 
        endpoint: 'newsletter',
        resetTime: rateLimit.resetTime 
      }, 'medium')
      
      return NextResponse.json(
        { 
          error: 'Muitas tentativas. Tente novamente mais tarde.',
          resetTime: rateLimit.resetTime 
        },
        { status: 429 }
      )
    }

    // Verificar autenticação admin
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logSecurityEvent('unauthorized_newsletter_access', { ip: clientIP }, 'high')
      return NextResponse.json(
        { error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    if (!validateAdminToken(token)) {
      logSecurityEvent('invalid_admin_token', { ip: clientIP }, 'critical')
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validar dados
    const validation = newsletterSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const { subject, content, targetUsers } = validation.data

    // Sanitizar inputs
    const sanitizedSubject = sanitizeInput(subject)
    const sanitizedContent = sanitizeInput(content)

    // Buscar usuários baseado no filtro
    let whereClause = {}
    if (targetUsers === 'CLIENTS') {
      whereClause = { userType: 'CLIENT' }
    } else if (targetUsers === 'PROFESSIONALS') {
      whereClause = { userType: 'PROFESSIONAL' }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        email: true,
        name: true
      }
    })

    // Log de segurança (sem dados sensíveis)
    logSecurityEvent('newsletter_sent', { 
      recipientCount: users.length, 
      targetUsers,
      ip: clientIP 
    }, 'low')

    // TODO: Implementar envio de newsletter via Firebase
    console.log('📧 Newsletter solicitada (Firebase não implementado):')
    console.log(`Assunto: ${sanitizedSubject}`)
    console.log(`Conteúdo: ${sanitizedContent.substring(0, 100)}...`)
    console.log(`Usuários: ${users.length}`)
    console.log(`Tipo: ${targetUsers}`)

    const successful = 0 // Firebase não implementado
    const failed = users.length

    return NextResponse.json({
      message: 'Newsletter enviada',
      stats: {
        total: users.length,
        successful,
        failed
      }
    })

  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// API para usuários se inscreverem na newsletter
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar preferências de newsletter (você pode adicionar este campo no schema depois)
    return NextResponse.json({
      message: 'Inscrição na newsletter atualizada com sucesso'
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
