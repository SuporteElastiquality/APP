import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    if (session.user.userType !== 'PROFESSIONAL') {
      return NextResponse.json(
        { error: 'Apenas profissionais podem desbloquear contatos' },
        { status: 403 }
      )
    }

    const { clientId } = await request.json()

    if (!clientId) {
      return NextResponse.json(
        { error: 'ID do cliente é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se já foi desbloqueado
    const existingUnlock = await prisma.coin.findFirst({
      where: {
        userId: session.user.id,
        description: `Desbloqueio de contato: ${clientId}`,
        type: 'DEBIT'
      }
    })

    if (existingUnlock) {
      // Retornar dados do cliente
      const client = await prisma.user.findUnique({
        where: { id: clientId },
        include: {
          clientProfile: true
        }
      })

      if (!client || !client.clientProfile) {
        return NextResponse.json(
          { error: 'Cliente não encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: {
            district: client.clientProfile.district,
            council: client.clientProfile.council,
            parish: client.clientProfile.parish,
            morada: client.clientProfile.morada,
            postalCode: client.clientProfile.postalCode
          }
        }
      })
    }

    // Verificar saldo de moedas
    const coins = await prisma.coin.findMany({
      where: { userId: session.user.id }
    })

    const balance = coins.reduce((total, coin) => {
      return coin.type === 'CREDIT' ? total + coin.amount : total - coin.amount
    }, 0)

    if (balance < 1) {
      return NextResponse.json(
        { error: 'Saldo insuficiente. Você precisa de pelo menos 1 moeda.' },
        { status: 400 }
      )
    }

    // Buscar dados do cliente
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: {
        clientProfile: true
      }
    })

    if (!client || !client.clientProfile) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Debitar 1 moeda
    await prisma.coin.create({
      data: {
        userId: session.user.id,
        amount: 1,
        type: 'DEBIT',
        description: `Desbloqueio de contato: ${clientId}`,
        source: 'contact_unlock'
      }
    })

    console.log(`✅ Contato desbloqueado: ${clientId} por profissional ${session.user.id}`)

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: {
          district: client.clientProfile.district,
          council: client.clientProfile.council,
          parish: client.clientProfile.parish,
          morada: client.clientProfile.morada,
          postalCode: client.clientProfile.postalCode
        }
      },
      remainingCoins: balance - 1
    })

  } catch (error) {
    console.error('Erro ao desbloquear contato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
