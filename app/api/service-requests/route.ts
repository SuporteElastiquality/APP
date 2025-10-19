import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Construir filtros base
    const whereClause: any = {
      status: {
        in: ['PENDING', 'IN_PROGRESS']
      }
    }

    // Se for um profissional, filtrar por suas categorias e distritos
    if (session?.user?.userType === 'PROFESSIONAL') {
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
        // Filtrar por categorias do profissional
        if (professionalProfile.categories && professionalProfile.categories.length > 0) {
          whereClause.service = {
            categoryId: {
              in: professionalProfile.categories
            }
          }
        }

        // Filtrar por distritos de trabalho do profissional
        if (professionalProfile.workDistricts && professionalProfile.workDistricts.length > 0) {
          whereClause.district = {
            in: professionalProfile.workDistricts
          }
        }
      }
    }

    // Filtros adicionais
    if (category && category !== 'all') {
      whereClause.service = {
        categoryId: category
      }
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Buscar solicitações
    const [requests, totalCount] = await Promise.all([
      prisma.serviceRequest.findMany({
        where: whereClause,
        include: {
          client: {
            select: {
              name: true,
              email: true
            }
          },
          service: {
            select: {
              name: true,
              category: {
                select: {
                  name: true
                }
              }
            }
          },
          proposals: {
            select: {
              id: true,
              price: true,
              description: true,
              estimatedTime: true,
              status: true,
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
      }),
      prisma.serviceRequest.count({
        where: whereClause
      })
    ])

    // Buscar categorias disponíveis
    const categories = await prisma.serviceCategory.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      requests,
      categories,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar solicitações de serviços:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}