import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNewsletterEmail } from '@/lib/email'
import { z } from 'zod'

// Schema para validação da newsletter
const newsletterSchema = z.object({
  subject: z.string().min(1, 'Assunto é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  targetUsers: z.enum(['ALL', 'CLIENTS', 'PROFESSIONALS']).default('ALL')
})

export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin (você pode implementar autenticação admin depois)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
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

    console.log(`Sending newsletter to ${users.length} users`)

    // Enviar emails
    const results = await Promise.allSettled(
      users.map(user => 
        sendNewsletterEmail(user.email, user.name || 'Usuário', content)
      )
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

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
