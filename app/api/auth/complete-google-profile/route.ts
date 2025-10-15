import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para completar perfil Google
const completeProfileSchema = z.object({
  userType: z.enum(['CLIENT', 'PROFESSIONAL']),
  phone: z.string().regex(/^9[0-9]{8}$/, 'Telefone deve ter 9 dígitos começando com 9'),
  district: z.string().min(1, 'Distrito é obrigatório'),
  council: z.string().min(1, 'Conselho é obrigatório'),
  parish: z.string().min(1, 'Freguesia é obrigatória'),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  specialties: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => {
  // Para profissionais, especialidades e experiência são obrigatórias
  if (data.userType === 'PROFESSIONAL') {
    return data.specialties && data.experience
  }
  return true
}, {
  message: 'Profissionais devem informar especialidades e experiência',
  path: ['specialties']
})

export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validar dados com Zod
    const validation = completeProfileSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos', 
          details: validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Verificar se o usuário já tem perfil completo
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        clientProfile: true,
        professionalProfile: true
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Se já tem perfil completo, retornar erro
    if (existingUser.userType && (existingUser.clientProfile || existingUser.professionalProfile)) {
      return NextResponse.json(
        { error: 'Perfil já está completo' },
        { status: 400 }
      )
    }

    // Atualizar usuário com tipo e telefone
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        userType: data.userType as 'CLIENT' | 'PROFESSIONAL',
        phone: data.phone,
      }
    })

    // Criar perfil específico baseado no tipo
    if (data.userType === 'CLIENT') {
      await prisma.clientProfile.create({
        data: {
          userId: updatedUser.id,
          district: data.district,
          council: data.council,
          parish: data.parish,
          address: data.address,
          postalCode: data.postalCode,
        }
      })
    } else {
      await prisma.professionalProfile.create({
        data: {
          userId: updatedUser.id,
          district: data.district,
          council: data.council,
          parish: data.parish,
          address: data.address,
          postalCode: data.postalCode,
          specialties: data.specialties!.split(',').map(s => s.trim()).join(','),
          experience: data.experience!,
          bio: data.bio,
        }
      })
    }

    return NextResponse.json({
      message: 'Perfil completado com sucesso',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        userType: updatedUser.userType
      }
    })

  } catch (error) {
    console.error('Complete profile error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
