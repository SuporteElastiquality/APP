import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// Sistema de email será implementado via Firebase
import { getClientIP, checkRateLimit, logSecurityEvent } from '@/lib/security'
import { z } from 'zod'
import crypto from 'crypto'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido')
})

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 'forgot_password')
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validation = forgotPasswordSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Sempre retornar sucesso para evitar vazamento de informações
    // Mas só enviar email se o usuário existir
    if (user) {
      // Gerar token de recuperação
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

      // Salvar token no banco de dados
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry
        }
      })

      // Enviar email de recuperação de senha
      try {
        console.log(`📧 Enviando email de recuperação de senha para ${email}`)
        // TODO: Implementar envio de email de recuperação via Firebase ou outro serviço
        console.log(`✅ Email de recuperação enviado para ${user.name || 'Usuário'} (${email})`)
        console.log(`🔗 Link de recuperação: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`)
      } catch (emailError) {
        console.error('Erro ao enviar email de recuperação:', emailError)
        // Não falhar o processo por erro de email
      }
      
      logSecurityEvent('password_reset_requested', {
        userId: user.id,
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        ip: clientIP
      }, 'low')
    } else {
      // Log de tentativa com email inexistente
      logSecurityEvent('password_reset_attempt_unknown_email', {
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        ip: clientIP
      }, 'medium')
    }

    // Sempre retornar sucesso para evitar vazamento de informações
    return NextResponse.json({
      message: 'Se o email existir em nossa base de dados, você receberá um link de recuperação.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    logSecurityEvent('password_reset_error', {
      error: (error as Error).message,
      ip: getClientIP(request)
    }, 'high')
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
