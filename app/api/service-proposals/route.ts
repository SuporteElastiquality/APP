import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProposalSchema = z.object({
  requestId: z.string().min(1, 'ID da solicitação é obrigatório'),
  price: z.number().min(0, 'Preço deve ser positivo'),
  estimatedTime: z.string().min(1, 'Tempo estimado é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').max(1000, 'Descrição muito longa')
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.userType !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Apenas profissionais podem enviar propostas' }, { status: 403 })
    }

    const body = await request.json()
    console.log('Received proposal data:', body)
    
    // Validar dados
    const validationResult = createProposalSchema.safeParse(body)
    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.issues)
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Verificar se a solicitação existe e está ativa
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: data.requestId },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        service: {
          select: { name: true, category: { select: { name: true } } }
        }
      }
    })

    if (!serviceRequest) {
      return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
    }

    if (serviceRequest.status !== 'PENDING') {
      return NextResponse.json({ error: 'Esta solicitação não aceita mais propostas' }, { status: 400 })
    }

    // Verificar se o profissional já enviou uma proposta para esta solicitação
    const existingProposal = await prisma.serviceProposal.findFirst({
      where: {
        requestId: data.requestId,
        professionalId: session.user.id
      }
    })

    if (existingProposal) {
      return NextResponse.json({ error: 'Você já enviou uma proposta para esta solicitação' }, { status: 400 })
    }

    // Criar proposta
    const proposal = await prisma.serviceProposal.create({
      data: {
        requestId: data.requestId,
        professionalId: session.user.id,
        price: data.price,
        estimatedTime: data.estimatedTime,
        description: data.description,
        status: 'PENDING'
      },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            professionalProfile: {
              select: {
                rating: true,
                totalReviews: true
              }
            }
          }
        }
      }
    })

    // TODO: Enviar notificação por email para o cliente
    console.log(`Proposta criada para solicitação ${data.requestId} pelo profissional ${session.user.id}`)

    return NextResponse.json(proposal, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar proposta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
