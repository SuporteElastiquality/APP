import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
// UserType será inferido do schema
import { registerSchema, validateData } from '@/lib/validations'
import { sendWelcomeEmail } from '@/lib/email'
import { getClientIP, checkRateLimit, logSecurityEvent } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Rate limiting para registro
    const rateLimit = checkRateLimit(clientIP, 'register')
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', { 
        ip: clientIP, 
        endpoint: 'register',
        resetTime: rateLimit.resetTime 
      }, 'medium')
      
      return NextResponse.json(
        { 
          error: 'Muitas tentativas de registro. Tente novamente mais tarde.',
          resetTime: rateLimit.resetTime 
        },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validar dados com Zod
    const validation = validateData(registerSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.errors },
        { status: 400 }
      )
    }

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
    } = validation.data!

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      logSecurityEvent('duplicate_registration_attempt', { 
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), 
        ip: clientIP 
      }, 'medium')
      
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
        password: hashedPassword,
        userType: userType,
      } as any
    })

    // Criar perfil específico baseado no tipo
    if (userType === 'CLIENT') {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
          district,
          council,
          parish,
          morada: address || '',
          postalCode: postalCode || ''
        }
      })
    } else {
      await prisma.professionalProfile.create({
        data: {
          userId: user.id,
          district,
          council,
          parish,
          specialties: specialties?.split(',').map(s => s.trim()).join(',') || '',
          experience: experience || ''
        }
      })
    }

    // Enviar email de boas-vindas (não bloqueia a resposta)
    sendWelcomeEmail(email, name).catch(error => {
      console.error('Failed to send welcome email:', error)
    })

    // Log de sucesso (sem dados sensíveis)
    logSecurityEvent('user_registered', { 
      userId: user.id, 
      userType: user.userType,
      ip: clientIP 
    }, 'low')

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
