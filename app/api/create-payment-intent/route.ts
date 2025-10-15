import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { paymentIntentSchema, validateData } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validar dados com Zod
    const validation = validateData(paymentIntentSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.errors },
        { status: 400 }
      )
    }

    const { amount, currency, serviceRequestId } = validation.data!

    // Criar Payment Intent no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: currency?.toLowerCase() || 'eur',
      metadata: {
        userId: session.user.id,
        serviceRequestId,
      },
    })

    // Salvar transação no banco de dados
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: amount,
        currency: currency?.toUpperCase() || 'EUR',
        description: `Pagamento para solicitação ${serviceRequestId}`,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
