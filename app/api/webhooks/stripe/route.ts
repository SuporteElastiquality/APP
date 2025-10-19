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

        if (transaction && paymentIntent.metadata?.coins) {
          // Usar quantidade de moedas do metadata
          const coinsAmount = parseInt(paymentIntent.metadata.coins)
          
          await prisma.coin.create({
            data: {
              userId: transaction.userId,
              amount: coinsAmount,
              type: 'CREDIT',
              description: `Compra de ${coinsAmount} moedas - Pacote ${paymentIntent.metadata.packageId}`,
              source: 'stripe_payment',
            },
          })

          console.log(`✅ Moedas creditadas: ${coinsAmount} para usuário ${transaction.userId}`)
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

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log(`🔔 Webhook checkout.session.completed recebido: ${session.id}`)
        console.log(`📊 Metadata:`, session.metadata)
        
        // Atualizar transação no banco usando o Checkout Session ID
        await prisma.transaction.update({
          where: {
            stripePaymentIntentId: session.id,
          },
          data: {
            status: 'COMPLETED',
            stripeChargeId: session.payment_intent as string,
          },
        })

        // Adicionar moedas ao usuário
        const transaction = await prisma.transaction.findUnique({
          where: {
            stripePaymentIntentId: session.id,
          },
        })

        if (transaction && session.metadata?.coins) {
          // Usar quantidade de moedas do metadata
          const coinsAmount = parseInt(session.metadata.coins)
          
          await prisma.coin.create({
            data: {
              userId: transaction.userId,
              amount: coinsAmount,
              type: 'CREDIT',
              description: `Compra de ${coinsAmount} moedas - Pacote ${session.metadata.packageId}`,
              source: 'stripe_payment',
            },
          })

          console.log(`✅ Moedas creditadas: ${coinsAmount} para usuário ${transaction.userId}`)
        } else {
          console.log(`❌ Transação não encontrada ou metadata inválido:`, {
            transactionFound: !!transaction,
            metadata: session.metadata
          })
        }

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
