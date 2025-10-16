import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rotas que precisam de autenticação
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/requests',
  '/api/chat',
  '/api/create-payment-intent',
  '/api/newsletter'
]

// Rotas de admin
const adminRoutes = [
  '/admin',
  '/api/newsletter'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      // Redirecionar para login se não autenticado
      const loginUrl = new URL('/auth/signin', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Verificar se é rota de admin
    if (isAdminRoute) {
      // Verificar se é admin (você pode implementar role-based auth depois)
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Acesso negado - Token de admin necessário' },
          { status: 403 }
        )
      }
    }
  }
  
  // Headers de segurança
  const response = NextResponse.next()
  
  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevenir MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Content Security Policy básico
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://resend.com https://nominatim.openstreetmap.org;"
  )
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
