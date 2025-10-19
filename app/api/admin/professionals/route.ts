import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.email !== 'admin@elastiquality.pt') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  try {
    const professionals = await prisma.user.findMany({
      where: { userType: 'PROFESSIONAL' },
      include: {
        professionalProfile: true,
        _count: {
          select: {
            serviceRequests: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Converter specialties de string para array
    const professionalsWithArraySpecialties = professionals.map(professional => ({
      ...professional,
      professionalProfile: professional.professionalProfile ? {
        ...professional.professionalProfile,
        specialties: professional.professionalProfile.specialties 
          ? professional.professionalProfile.specialties.split(',').map(s => s.trim()).filter(s => s.length > 0)
          : []
      } : null
    }))

    return NextResponse.json({ professionals: professionalsWithArraySpecialties })
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
