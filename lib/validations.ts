import { z } from 'zod'

// Schema de validação para registro de usuário
export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos 1 letra minúscula, 1 maiúscula e 1 número'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  phone: z.string()
    .regex(/^9[0-9]{8}$/, 'Telefone deve ter 9 dígitos começando com 9'),
  userType: z.enum(['CLIENT', 'PROFESSIONAL']),
  district: z.string().min(1, 'Distrito é obrigatório'),
  council: z.string().min(1, 'Conselho é obrigatório'),
  parish: z.string().min(1, 'Freguesia é obrigatória'),
  specialties: z.string().optional(),
  experience: z.string().optional(),
}).refine((data) => {
  // Senhas devem coincidir
  return data.password === data.confirmPassword
}, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
}).refine((data) => {
  // Para profissionais, especialidades e experiência são obrigatórias
  if (data.userType === 'PROFESSIONAL') {
    return data.specialties && data.experience
  }
  return true
}, {
  message: 'Profissionais devem informar especialidades e experiência',
  path: ['specialties']
})

// Schema de validação para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

// Schema de validação para solicitação de serviço
export const serviceRequestSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres'),
  district: z.string().min(1, 'Distrito é obrigatório'),
  council: z.string().min(1, 'Conselho é obrigatório'),
  parish: z.string().min(1, 'Freguesia é obrigatória'),
  address: z.string().optional(),
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  budgetMin: z.number().min(0, 'Orçamento mínimo deve ser positivo').optional(),
  budgetMax: z.number().min(0, 'Orçamento máximo deve ser positivo').optional(),
  deadline: z.string().datetime().optional(),
}).refine((data) => {
  // Orçamento máximo deve ser maior que mínimo
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMax >= data.budgetMin
  }
  return true
}, {
  message: 'Orçamento máximo deve ser maior ou igual ao mínimo',
  path: ['budgetMax']
})

// Schema de validação para proposta de serviço
export const serviceProposalSchema = z.object({
  requestId: z.string().min(1, 'ID da solicitação é obrigatório'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres'),
  estimatedTime: z.string().min(1, 'Tempo estimado é obrigatório'),
})

// Schema de validação para avaliação
export const reviewSchema = z.object({
  professionalId: z.string().min(1, 'ID do profissional é obrigatório'),
  requestId: z.string().optional(),
  rating: z.number().min(1, 'Avaliação deve ser pelo menos 1').max(5, 'Avaliação deve ser no máximo 5'),
  comment: z.string().optional(),
})

// Schema de validação para mensagens de chat
export const messageSchema = z.object({
  roomId: z.string().min(1, 'ID da sala é obrigatório'),
  content: z.string().min(1, 'Conteúdo da mensagem é obrigatório').max(1000, 'Mensagem muito longa'),
  type: z.enum(['TEXT', 'IMAGE', 'FILE']).default('TEXT'),
})

// Schema de validação para parâmetros de query de mensagens
export const messageQuerySchema = z.object({
  roomId: z.string().min(1, 'ID da sala é obrigatório'),
  limit: z.string().regex(/^\d+$/, 'Limit deve ser um número').transform(Number).default('50'),
  offset: z.string().regex(/^\d+$/, 'Offset deve ser um número').transform(Number).default('0'),
})

// Schema de validação para criação de sala de chat
export const chatRoomSchema = z.object({
  participantId: z.string().min(1, 'ID do participante é obrigatório'),
  type: z.enum(['DIRECT', 'GROUP']).default('DIRECT'),
})

// Schema de validação para pagamento
export const paymentIntentSchema = z.object({
  amount: z.number().min(1, 'Valor deve ser maior que zero'),
  currency: z.string().length(3, 'Moeda deve ter 3 caracteres').default('eur'),
  serviceRequestId: z.string().min(1, 'ID da solicitação é obrigatório'),
})

// Schema de validação para webhook do Stripe
export const stripeWebhookSchema = z.object({
  type: z.string().min(1, 'Tipo do evento é obrigatório'),
  data: z.object({
    object: z.any()
  })
})

// Função auxiliar para validar dados
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: any } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten()
      }
    }
    return {
      success: false,
      errors: { formErrors: ['Erro de validação desconhecido'], fieldErrors: {} }
    }
  }
}
