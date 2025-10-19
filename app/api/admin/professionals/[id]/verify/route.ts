import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.email !== 'admin@elastiquality.pt') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  try {
    const { isVerified } = await request.json()
    const professionalId = params.id

    // Verificar se o usuário é um profissional
    const user = await prisma.user.findUnique({
      where: { id: professionalId },
      include: { professionalProfile: true }
    })

    if (!user || user.userType !== 'PROFESSIONAL') {
      return NextResponse.json({ message: 'Usuário não encontrado ou não é um profissional' }, { status: 404 })
    }

    if (!user.professionalProfile) {
      return NextResponse.json({ message: 'Perfil profissional não encontrado' }, { status: 404 })
    }

    // Atualizar status de verificação
    await prisma.professionalProfile.update({
      where: { id: user.professionalProfile.id },
      data: { isVerified }
    })

    return NextResponse.json({ 
      message: `Profissional ${isVerified ? 'verificado' : 'desverificado'} com sucesso` 
    })
  } catch (error) {
    console.error('Erro ao atualizar verificação:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
