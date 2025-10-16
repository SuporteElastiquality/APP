import { NextResponse } from 'next/server'
import { getAllCategories } from '@/lib/categories'

export async function GET() {
  try {
    const categories = getAllCategories()
    
    return NextResponse.json({
      categories,
      total: categories.length
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
