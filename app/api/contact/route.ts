import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Sistema de email será implementado via Firebase ou outro serviço

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Selecione um assunto'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados
    const validatedData = contactSchema.parse(body)
    
    // Log da mensagem de contato (sistema de email será implementado via Firebase)
    console.log('📧 Nova mensagem de contato recebida:')
    console.log(`Nome: ${validatedData.name}`)
    console.log(`Email: ${validatedData.email}`)
    console.log(`Telefone: ${validatedData.phone || 'Não informado'}`)
    console.log(`Assunto: ${validatedData.subject}`)
    console.log(`Mensagem: ${validatedData.message}`)
    console.log(`Data: ${new Date().toISOString()}`)
    
    // TODO: Implementar envio de email via Firebase ou outro serviço
    console.log('⚠️ Sistema de email não configurado. Mensagem salva apenas em log.')

    return NextResponse.json(
      { message: 'Mensagem enviada com sucesso!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro no formulário de contato:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
