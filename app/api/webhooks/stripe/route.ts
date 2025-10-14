import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Atualizar transação no banco
        await prisma.transaction.update({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: 'COMPLETED',
            stripeChargeId: paymentIntent.latest_charge as string,
          },
        })

        // Adicionar moedas ao usuário
        const transaction = await prisma.transaction.findUnique({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
        })

        if (transaction) {
          // Calcular moedas baseado no valor (exemplo: 1 EUR = 10 moedas)
          const coinsAmount = Math.round(transaction.amount * 10)
          
          await prisma.coin.create({
            data: {
              userId: transaction.userId,
              amount: coinsAmount,
              type: 'CREDIT',
              description: `Compra de ${coinsAmount} moedas Elastiquality`,
              source: 'stripe_payment',
            },
          })
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Atualizar transação como falhada
        await prisma.transaction.update({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: 'FAILED',
          },
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
