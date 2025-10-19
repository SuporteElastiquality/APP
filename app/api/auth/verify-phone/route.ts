import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const verifyPhoneSchema = z.object({
  phone: z.string().regex(/^[0-9]{9}$/, 'Telefone deve ter 9 dígitos'),
  userId: z.string().min(1, 'ID do usuário é obrigatório')
})

const confirmPhoneSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  userId: z.string().min(1, 'ID do usuário é obrigatório')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, userId } = verifyPhoneSchema.parse(body)

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    if (user.phone !== phone) {
      return NextResponse.json({ message: 'Telefone não corresponde ao usuário' }, { status: 400 })
    }

    if (user.phoneVerified) {
      return NextResponse.json({ message: 'Telefone já verificado' }, { status: 400 })
    }

    // Gerar código de verificação (6 dígitos)
    const token = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

    // Salvar token no banco
    await prisma.phoneVerification.upsert({
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

    // TODO: Integrar com serviço de SMS (Twilio, etc.)
    // Por enquanto, retornamos o token para desenvolvimento
    console.log(`Código de verificação para ${phone}: ${token}`)

    return NextResponse.json({ 
      message: 'Código de verificação enviado por SMS',
      token: process.env.NODE_ENV === 'development' ? token : undefined // Só retorna em desenvolvimento
    })

  } catch (error) {
    console.error('Erro ao enviar verificação de telefone:', error)
    
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, userId } = confirmPhoneSchema.parse(body)

    // Buscar verificação pelo token
    const verification = await prisma.phoneVerification.findUnique({
      where: { userId },
      include: { user: true }
    })

    if (!verification) {
      return NextResponse.json({ message: 'Verificação não encontrada' }, { status: 404 })
    }

    if (verification.token !== token) {
      return NextResponse.json({ message: 'Código inválido' }, { status: 400 })
    }

    if (verification.expires < new Date()) {
      return NextResponse.json({ message: 'Código expirado' }, { status: 400 })
    }

    if (verification.verified) {
      return NextResponse.json({ message: 'Telefone já verificado' }, { status: 400 })
    }

    // Marcar como verificado
    await prisma.phoneVerification.update({
      where: { id: verification.id },
      data: { verified: true }
    })

    // Atualizar usuário
    await prisma.user.update({
      where: { id: verification.userId },
      data: { phoneVerified: new Date() }
    })

    return NextResponse.json({ 
      message: 'Telefone verificado com sucesso',
      user: {
        id: verification.user.id,
        phone: verification.user.phone,
        name: verification.user.name
      }
    })

  } catch (error) {
    console.error('Erro ao verificar telefone:', error)
    
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
