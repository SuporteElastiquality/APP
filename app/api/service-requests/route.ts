import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createServiceRequestSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres'),
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  budgetMin: z.number().positive().nullable().optional().transform(val => val === null ? undefined : val),
  budgetMax: z.number().positive().nullable().optional().transform(val => val === null ? undefined : val),
  district: z.string().min(1, 'Distrito é obrigatório'),
  council: z.string().min(1, 'Concelho é obrigatório'),
  parish: z.string().min(1, 'Freguesia é obrigatória'),
  address: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validar dados
    const validatedData = createServiceRequestSchema.parse(body)
    
    // Verificar se o serviço existe
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId }
    })
    
    if (!service) {
      return NextResponse.json(
        { message: 'Serviço não encontrado' },
        { status: 400 }
      )
    }

    // Verificar se o usuário é um cliente
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })
    
    if (!user || user.userType !== 'CLIENT') {
      return NextResponse.json(
        { message: 'Apenas clientes podem criar solicitações' },
        { status: 403 }
      )
    }

    // Validar orçamento
    if (validatedData.budgetMin && validatedData.budgetMax) {
      if (validatedData.budgetMin > validatedData.budgetMax) {
        return NextResponse.json(
          { message: 'Orçamento mínimo não pode ser maior que o máximo' },
          { status: 400 }
        )
      }
    }

    // Criar solicitação
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        clientId: session.user.id,
        serviceId: validatedData.serviceId,
        district: validatedData.district,
        council: validatedData.council,
        parish: validatedData.parish,
        address: validatedData.address,
        budgetMin: validatedData.budgetMin,
        budgetMax: validatedData.budgetMax,
        status: 'PENDING'
      },
      include: {
        service: {
          include: {
            category: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Solicitação criada com sucesso',
      serviceRequest
    })

  } catch (error) {
    console.error('Error creating service request:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'PENDING'

    const skip = (page - 1) * limit

    // Buscar solicitações do usuário
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        clientId: session.user.id,
        ...(status !== 'ALL' && { status })
      },
      include: {
        service: {
          include: {
            category: true
          }
        },
        proposals: {
          include: {
            professional: {
              select: {
                id: true,
                name: true,
                rating: true,
                totalReviews: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    const total = await prisma.serviceRequest.count({
      where: {
        clientId: session.user.id,
        ...(status !== 'ALL' && { status })
      }
    })

    return NextResponse.json({
      serviceRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching service requests:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
