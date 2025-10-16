import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getClientIP, logSecurityEvent } from '@/lib/security'

const updateProfessionalProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().regex(/^9\d{8}$/, 'Telefone deve ter 9 dígitos começando com 9'),
  district: z.string().min(1, 'Distrito é obrigatório'),
  council: z.string().min(1, 'Conselho é obrigatório'),
  parish: z.string().min(1, 'Freguesia é obrigatória'),
  address: z.string().min(5, 'Morada deve ter pelo menos 5 caracteres'),
  postalCode: z.string().regex(/^\d{4}-\d{3}$/, 'Código postal deve estar no formato 0000-000'),
  specialties: z.array(z.string()).min(1, 'Pelo menos uma especialidade é obrigatória'),
  experience: z.string().min(10, 'Experiência deve ter pelo menos 10 caracteres'),
  bio: z.string().optional()
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.userType !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        professionalProfile: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Calcular estatísticas do profissional
    // Por enquanto, usar dados do perfil profissional
    const totalJobs = user.professionalProfile?.completedJobs || 0
    const completedJobs = user.professionalProfile?.completedJobs || 0
    const reviews = [] // Por enquanto, sem reviews

    const averageRating = user.professionalProfile?.rating || 0

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      district: user.professionalProfile?.district || '',
      council: user.professionalProfile?.council || '',
      parish: user.professionalProfile?.parish || '',
      address: user.professionalProfile?.address || '',
      postalCode: user.professionalProfile?.postalCode || '',
      specialties: user.professionalProfile?.specialties?.split(',').filter(s => s.trim()) || [],
      experience: user.professionalProfile?.experience || '',
      bio: user.professionalProfile?.bio || '',
      rating: Math.round(averageRating * 10) / 10,
      totalReviews: user.professionalProfile?.totalReviews || 0,
      totalJobs,
      completedJobs,
      createdAt: user.createdAt.toISOString()
    }

    return NextResponse.json(profile)

  } catch (error) {
    console.error('Erro ao buscar perfil do profissional:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const clientIP = getClientIP(request)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (session.user.userType !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const validation = updateProfessionalProfileSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validation.error
        },
        { status: 400 }
      )
    }

    const {
      name,
      phone,
      district,
      council,
      parish,
      address,
      postalCode,
      specialties,
      experience,
      bio
    } = validation.data

    // Atualizar dados do usuário
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone
      }
    })

    // Atualizar ou criar perfil profissional
    if (updatedUser.professionalProfile) {
      await prisma.professionalProfile.update({
        where: { userId: session.user.id },
        data: {
          district,
          council,
          parish,
          address,
          postalCode,
          specialties: specialties.join(','),
          experience,
          bio
        }
      })
    } else {
      await prisma.professionalProfile.create({
        data: {
          userId: session.user.id,
          district,
          council,
          parish,
          address,
          postalCode,
          specialties: specialties.join(','),
          experience,
          bio
        }
      })
    }

    logSecurityEvent('professional_profile_updated', {
      userId: session.user.id,
      ip: clientIP
    }, 'low')

    return NextResponse.json({ message: 'Perfil atualizado com sucesso' })

  } catch (error) {
    console.error('Erro ao atualizar perfil do profissional:', error)
    logSecurityEvent('professional_profile_update_error', {
      error: (error as Error).message,
      ip: getClientIP(request)
    }, 'high')
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
