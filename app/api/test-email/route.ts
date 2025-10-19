import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    // TODO: Implementar teste de email via Firebase
    console.log('📧 Teste de email solicitado (Firebase não implementado):')
    console.log(`Email: ${email}`)
    console.log('Sistema de email será implementado via Firebase')

    return NextResponse.json({ 
      success: true, 
      message: 'Sistema de email será implementado via Firebase' 
    })

  } catch (error) {
    console.error('Erro no teste de email:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}