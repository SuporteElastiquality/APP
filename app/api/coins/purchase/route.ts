import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

const coinPackages = {
  single: { coins: 1, price: 1.00 },
  basic: { coins: 10, price: 9.90 },
  standard: { coins: 25, price: 23.75 },
  premium: { coins: 50, price: 45.00 },
  pro: { coins: 100, price: 85.00 }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Qualquer usuário pode comprar quality (moedas)
    // Removida restrição de apenas profissionais

    const { packageId, amount, coins } = await request.json()

    // Validar pacote
    const packageData = coinPackages[packageId as keyof typeof coinPackages]
    if (!packageData) {
      return NextResponse.json(
        { error: 'Pacote inválido' },
        { status: 400 }
      )
    }

    // Verificar se os valores correspondem
    if (packageData.coins !== coins || packageData.price !== amount) {
      return NextResponse.json(
        { error: 'Valores inválidos' },
        { status: 400 }
      )
    }

    // Criar transaction no banco
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: amount,
        currency: 'EUR',
        description: `Compra de ${coins} moedas - Pacote ${packageId}`,
        status: 'PENDING'
      }
    })

    // Criar Checkout Session no Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Pacote ${packageId} - ${coins} Quality`,
              description: `Compra de ${coins} moedas Elastiquality`
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/quality?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/quality?canceled=true`,
      metadata: {
        userId: session.user.id,
        transactionId: transaction.id,
        packageId: packageId,
        coins: coins.toString()
      },
      customer_email: session.user.email
    })

    // Atualizar transaction com Checkout Session ID
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { 
        stripePaymentIntentId: checkoutSession.id,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      clientSecret: checkoutSession.id
    })

  } catch (error) {
    console.error('Erro ao processar compra de moedas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
