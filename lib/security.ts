import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

// Rate limiting storage (em produção, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMITS = {
  login: { requests: 5, window: 15 * 60 * 1000 }, // 5 tentativas em 15 min
  register: { requests: 3, window: 60 * 60 * 1000 }, // 3 tentativas em 1 hora
  newsletter: { requests: 2, window: 60 * 60 * 1000 }, // 2 tentativas em 1 hora
  api: { requests: 100, window: 15 * 60 * 1000 }, // 100 requests em 15 min
}

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return request.ip || 'unknown'
}

export function checkRateLimit(
  identifier: string, 
  type: keyof typeof RATE_LIMITS
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const limit = RATE_LIMITS[type]
  const key = `${identifier}:${type}`
  
  const current = rateLimitMap.get(key)
  
  if (!current || now > current.resetTime) {
    // Reset or create new entry
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + limit.window
    })
    
    return {
      allowed: true,
      remaining: limit.requests - 1,
      resetTime: now + limit.window
    }
  }
  
  if (current.count >= limit.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    }
  }
  
  // Increment counter
  current.count++
  rateLimitMap.set(key, current)
  
  return {
    allowed: true,
    remaining: limit.requests - current.count,
    resetTime: current.resetTime
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags básicos
    .substring(0, 1000) // Limite de caracteres
}

export function validateAdminToken(token: string): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) {
    console.error('ADMIN_SECRET not configured')
    return false
  }
  
  // Verificar se o token é forte o suficiente
  if (adminSecret.length < 32) {
    console.error('ADMIN_SECRET is too weak')
    return false
  }
  
  return token === adminSecret
}

export function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function logSecurityEvent(
  event: string, 
  details: Record<string, any>, 
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    event,
    severity,
    details: {
      ...details,
      // Sanitizar dados sensíveis
      password: details.password ? '[REDACTED]' : undefined,
      token: details.token ? '[REDACTED]' : undefined,
      email: details.email ? details.email.replace(/(.{2}).*(@.*)/, '$1***$2') : undefined,
    }
  }
  
  console.log(`[SECURITY-${severity.toUpperCase()}]`, JSON.stringify(logEntry))
  
  // Em produção, enviar para serviço de monitoramento
  if (severity === 'critical' || severity === 'high') {
    // TODO: Integrar com serviço de alertas (Sentry, DataDog, etc.)
  }
}
