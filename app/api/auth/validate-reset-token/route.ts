import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIP, logSecurityEvent } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const clientIP = getClientIP(request)

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 400 }
      )
    }

    // Buscar usuário pelo token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token ainda não expirou
        }
      }
    })

    if (!user) {
      logSecurityEvent('invalid_reset_token_attempt', {
        token: token.substring(0, 8) + '...',
        ip: clientIP
      }, 'medium')

      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    logSecurityEvent('valid_reset_token_accessed', {
      userId: user.id,
      ip: clientIP
    }, 'low')

    return NextResponse.json({
      valid: true,
      message: 'Token válido'
    })

  } catch (error) {
    console.error('Validate reset token error:', error)
    logSecurityEvent('validate_reset_token_error', {
      error: (error as Error).message,
      ip: getClientIP(request)
    }, 'high')
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
