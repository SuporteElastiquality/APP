import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

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
    
    // Enviar email para contato@elastiquality.pt
    const { data: adminEmail, error: adminError } = await resend.emails.send({
      from: 'Elastiquality <noreply@elastiquality.pt>',
      to: ['contato@elastiquality.pt'],
      subject: `Nova mensagem de contato: ${validatedData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nova Mensagem de Contato</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Informações do Contato</h3>
            <p><strong>Nome:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            ${validatedData.phone ? `<p><strong>Telefone:</strong> ${validatedData.phone}</p>` : ''}
            <p><strong>Assunto:</strong> ${validatedData.subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Mensagem</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${validatedData.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              Esta mensagem foi enviada através do formulário de contato do site Elastiquality.
            </p>
          </div>
        </div>
      `
    })

    if (adminError) {
      console.error('Erro ao enviar email para admin:', adminError)
      return NextResponse.json(
        { error: 'Erro ao enviar mensagem. Tente novamente.' },
        { status: 500 }
      )
    }

    // Enviar email de confirmação para o usuário
    const { data: userEmail, error: userError } = await resend.emails.send({
      from: 'Elastiquality <noreply@elastiquality.pt>',
      to: [validatedData.email],
      subject: 'Confirmação de recebimento - Elastiquality',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
              Obrigado pelo seu contato!
            </h1>
          </div>
          
          <div style="padding: 40px 20px; background-color: #ffffff;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Olá <strong>${validatedData.name}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Recebemos a sua mensagem sobre <strong>"${validatedData.subject}"</strong> e agradecemos o seu interesse na Elastiquality.
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              A nossa equipa irá analisar o seu pedido e entraremos em contacto consigo o mais breve possível, normalmente dentro de 24 horas.
            </p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #2563eb; margin: 0 0 15px 0; font-size: 18px;">Resumo da sua mensagem:</h3>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;"><strong>Assunto:</strong> ${validatedData.subject}</p>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;"><strong>Data:</strong> ${new Date().toLocaleDateString('pt-PT')}</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Enquanto aguarda, convidamo-lo a explorar os nossos serviços e a conhecer os profissionais certificados disponíveis na nossa plataforma.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://elastiquality.pt" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Visitar Site
              </a>
            </div>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Esta é uma mensagem automática. Por favor, não responda a este email.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
              Para mais informações, contacte-nos através de <strong>contato@elastiquality.pt</strong>
            </p>
          </div>
        </div>
      `
    })

    if (userError) {
      console.error('Erro ao enviar email de confirmação:', userError)
      // Não falhamos o processo se o email de confirmação falhar
      console.log('Email de confirmação falhou, mas email para admin foi enviado')
    }

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
