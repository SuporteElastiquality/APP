import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmailVerification } from '@/lib/email'
import { z } from 'zod'

const verifyEmailSchema = z.object({
  email: z.string().email('Email inválido'),
  userId: z.string().min(1, 'ID do usuário é obrigatório')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, userId } = verifyEmailSchema.parse(body)

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    if (user.email !== email) {
      return NextResponse.json({ message: 'Email não corresponde ao usuário' }, { status: 400 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email já verificado' }, { status: 400 })
    }

    // Gerar token de verificação
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Salvar token no banco
    await prisma.emailVerification.upsert({
      where: { userId },
      update: {
        token,
        expires,
        verified: false
      },
      create: {
        userId,
        token,
        expires,
        verified: false
      }
    })

    // Enviar email de verificação
    await sendEmailVerification(email, token, user.name || 'Usuário')

    return NextResponse.json({ 
      message: 'Email de verificação enviado com sucesso',
      token 
    })

  } catch (error) {
    console.error('Erro ao enviar verificação de email:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: 'Dados inválidos', 
        errors: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 400 })
    }

    // Buscar verificação pelo token
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!verification) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 400 })
    }

    if (verification.expires < new Date()) {
      return NextResponse.json({ message: 'Token expirado' }, { status: 400 })
    }

    if (verification.verified) {
      return NextResponse.json({ message: 'Email já verificado' }, { status: 400 })
    }

    // Marcar como verificado
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { verified: true }
    })

    // Atualizar usuário
    await prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerified: new Date() }
    })

    return NextResponse.json({ 
      message: 'Email verificado com sucesso',
      user: {
        id: verification.user.id,
        email: verification.user.email,
        name: verification.user.name
      }
    })

  } catch (error) {
    console.error('Erro ao verificar email:', error)
    return NextResponse.json({ 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
