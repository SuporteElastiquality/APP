import { NextRequest, NextResponse } from 'next/server'
import { sendNewsletterEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Enviar email de teste
    const result = await sendNewsletterEmail(
      email, 
      name, 
      `
        <h2>🎉 Teste do Sistema de Email!</h2>
        <p>Olá ${name}!</p>
        <p>Este é um teste do sistema de email do Elastiquality.</p>
        <p>Se você está recebendo este email no endereço ${email}, o sistema está funcionando perfeitamente!</p>
        <p><strong>Data do teste:</strong> ${new Date().toLocaleString('pt-PT')}</p>
        <p>Atenciosamente,<br>Equipe Elastiquality</p>
      `
    )

    if (result.success) {
      return NextResponse.json({
        message: 'Email de teste enviado com sucesso!',
        email,
        name,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json(
        { error: 'Falha ao enviar email', details: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Endpoint GET para verificar se está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'API de teste de email funcionando',
    status: 'ok',
    timestamp: new Date().toISOString()
  })
}
