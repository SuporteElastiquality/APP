import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { UserType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      phone,
      userType,
      district,
      council,
      parish,
      specialties,
      experience
    } = await request.json()

    // Validar dados obrigatórios
    if (!name || !email || !password || !phone || !district || !council || !parish) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    // Validar tipo de usuário
    if (!['CLIENT', 'PROFESSIONAL'].includes(userType)) {
      return NextResponse.json(
        { error: 'Tipo de usuário inválido' },
        { status: 400 }
      )
    }

    // Validar especialidades para profissionais
    if (userType === 'PROFESSIONAL' && (!specialties || !experience)) {
      return NextResponse.json(
        { error: 'Profissionais devem informar especialidades e experiência' },
        { status: 400 }
      )
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está em uso' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        userType: userType as UserType,
        // Para NextAuth.js, vamos usar um campo customizado para senha
        // Em produção, você deve criar uma tabela separada para credenciais
      }
    })

    // Criar perfil específico baseado no tipo
    if (userType === 'CLIENT') {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
          district,
          council,
          parish
        }
      })
    } else {
      await prisma.professionalProfile.create({
        data: {
          userId: user.id,
          district,
          council,
          parish,
          specialties: specialties.split(',').map(s => s.trim()),
          experience
        }
      })
    }

    return NextResponse.json({
      message: 'Conta criada com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
