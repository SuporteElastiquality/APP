import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateData } from '@/lib/validations'
import { z } from 'zod'

const updateClientProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().regex(/^9\d{8}$/, 'Telefone deve ter 9 dígitos começando com 9'),
  district: z.string().min(1, 'Distrito é obrigatório'),
  council: z.string().min(1, 'Conselho é obrigatório'),
  parish: z.string().min(1, 'Freguesia é obrigatória'),
  postalCode: z.string().regex(/^\d{4}-\d{3}$/, 'Código postal deve estar no formato 0000-000').optional()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.userType !== 'CLIENT') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Buscar dados do usuário e perfil do cliente
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        clientProfile: true,
        serviceRequests: {
          select: {
            id: true,
            status: true,
            createdAt: true
          }
        },
        clientReviews: {
          select: {
            rating: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Calcular estatísticas
    const totalRequests = user.serviceRequests.length
    const completedRequests = user.serviceRequests.filter(req => req.status === 'COMPLETED').length
    const averageRating = user.clientReviews.length > 0 
      ? user.clientReviews.reduce((sum, review) => sum + review.rating, 0) / user.clientReviews.length
      : 0

    const profile = {
      id: user.id,
      name: user.name || '',
      email: user.email,
      phone: user.phone || '',
      district: user.clientProfile?.district || '',
      council: user.clientProfile?.council || '',
      parish: user.clientProfile?.parish || '',
      postalCode: user.clientProfile?.postalCode || '',
      createdAt: user.createdAt,
      stats: {
        totalRequests,
        completedRequests,
        averageRating: Math.round(averageRating * 10) / 10
      }
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Erro ao carregar perfil do cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.userType !== 'CLIENT') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const validation = validateData(updateClientProfileSchema, body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: validation.errors }, { status: 400 })
    }

    const { name, phone, district, council, parish, postalCode } = validation.data!

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone
      },
      include: {
        clientProfile: true
      }
    })

    // Atualizar ou criar perfil do cliente
    if (updatedUser.clientProfile) {
      await prisma.clientProfile.update({
        where: { userId: session.user.id },
        data: {
          district,
          council,
          parish,
          postalCode
        }
      })
    } else {
      await prisma.clientProfile.create({
        data: {
          userId: session.user.id,
          district,
          council,
          parish,
          postalCode
        }
      })
    }

    return NextResponse.json({ message: 'Perfil atualizado com sucesso' })
  } catch (error) {
    console.error('Erro ao atualizar perfil do cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
