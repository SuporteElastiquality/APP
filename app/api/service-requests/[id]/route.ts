import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const requestId = params.id

    // Buscar a solicitação de serviço
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: {
        id: requestId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        service: {
          include: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!serviceRequest) {
      return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
    }

    // Se for um profissional, verificar se a solicitação está nas suas categorias e distritos
    if (session.user.userType === 'PROFESSIONAL') {
      const professionalProfile = await prisma.professionalProfile.findUnique({
        where: {
          userId: session.user.id
        },
        select: {
          categories: true,
          workDistricts: true
        }
      })

      if (professionalProfile) {
        // Verificar se a categoria está nas categorias do profissional
        const hasMatchingCategory = !professionalProfile.categories || 
          professionalProfile.categories.length === 0 ||
          professionalProfile.categories.includes(serviceRequest.service.categoryId)

        // Verificar se o distrito está nos distritos de trabalho do profissional
        const hasMatchingDistrict = !professionalProfile.workDistricts || 
          professionalProfile.workDistricts.length === 0 ||
          professionalProfile.workDistricts.includes(serviceRequest.district)

        if (!hasMatchingCategory || !hasMatchingDistrict) {
          return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }
      }
    }

    return NextResponse.json(serviceRequest)
  } catch (error) {
    console.error('Erro ao buscar solicitação de serviço:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const requestId = params.id

    // Buscar a solicitação para validar propriedade
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      select: { id: true, clientId: true }
    })

    if (!serviceRequest) {
      return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
    }

    // Apenas o cliente dono pode apagar
    if (session.user.userType !== 'CLIENT' || serviceRequest.clientId !== session.user.id) {
      return NextResponse.json({ error: 'Apenas o cliente pode eliminar esta solicitação' }, { status: 403 })
    }

    // Remover propostas relacionadas (por segurança, caso não haja cascade)
    await prisma.serviceProposal.deleteMany({ where: { serviceRequestId: requestId } })

    // Remover a solicitação
    await prisma.serviceRequest.delete({ where: { id: requestId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao eliminar solicitação de serviço:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
