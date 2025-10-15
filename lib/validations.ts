import { z } from 'zod'

// Dados geográficos de Portugal
const PORTUGUESE_DISTRICTS = [
  'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 'Évora',
  'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre', 'Porto', 'Santarém',
  'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu', 'Açores', 'Madeira'
]

const PORTUGUESE_SPECIALTIES = [
  'Canalizações', 'Eletricidade', 'Pintura', 'Carpintaria', 'Alvenaria',
  'Telhados', 'Aquecimento', 'Ar Condicionado', 'Jardinagem', 'Limpeza',
  'Mudanças', 'Reparações Gerais', 'Construção', 'Renovação', 'Manutenção',
  'Instalações', 'Reparações Automóveis', 'Informática', 'Fotografia',
  'Catering', 'Organização de Eventos', 'Design', 'Consultoria'
]

const SERVICE_STATUS = [
  'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'
]

// Schema de validação para registro de usuário
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email muito longo')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos 1 letra minúscula, 1 maiúscula e 1 número'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  phone: z.string()
    .regex(/^9[0-9]{8}$/, 'Telefone português deve ter 9 dígitos começando com 9'),
  userType: z.enum(['CLIENT', 'PROFESSIONAL']),
  district: z.enum(PORTUGUESE_DISTRICTS as [string, ...string[]], {
    errorMap: () => ({ message: 'Distrito deve ser um distrito português válido' })
  }),
  council: z.string()
    .min(1, 'Conselho é obrigatório')
    .max(100, 'Nome do conselho muito longo'),
  parish: z.string()
    .min(1, 'Freguesia é obrigatória')
    .max(100, 'Nome da freguesia muito longo'),
  specialties: z.string().optional(),
  experience: z.string().optional(),
  postalCode: z.string()
    .regex(/^\d{4}-\d{3}$/, 'Código postal deve estar no formato XXXX-XXX')
    .optional(),
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
  title: z.string()
    .min(5, 'Título deve ter pelo menos 5 caracteres')
    .max(100, 'Título muito longo'),
  description: z.string()
    .min(20, 'Descrição deve ter pelo menos 20 caracteres')
    .max(2000, 'Descrição muito longa'),
  district: z.enum(PORTUGUESE_DISTRICTS as [string, ...string[]], {
    errorMap: () => ({ message: 'Distrito deve ser um distrito português válido' })
  }),
  council: z.string()
    .min(1, 'Conselho é obrigatório')
    .max(100, 'Nome do conselho muito longo'),
  parish: z.string()
    .min(1, 'Freguesia é obrigatória')
    .max(100, 'Nome da freguesia muito longo'),
  address: z.string()
    .max(200, 'Endereço muito longo')
    .optional(),
  postalCode: z.string()
    .regex(/^\d{4}-\d{3}$/, 'Código postal deve estar no formato XXXX-XXX')
    .optional(),
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  budgetMin: z.number()
    .min(0, 'Orçamento mínimo não pode ser negativo')
    .max(100000, 'Orçamento mínimo muito alto')
    .optional(),
  budgetMax: z.number()
    .min(0, 'Orçamento máximo não pode ser negativo')
    .max(100000, 'Orçamento máximo muito alto')
    .optional(),
  deadline: z.string()
    .datetime('Data de prazo inválida')
    .optional(),
}).refine((data) => {
  // Orçamento máximo deve ser maior que mínimo
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMax >= data.budgetMin
  }
  return true
}, {
  message: 'Orçamento máximo deve ser maior ou igual ao mínimo',
  path: ['budgetMax']
}).refine((data) => {
  // Orçamento mínimo deve ser pelo menos 1€
  if (data.budgetMin) {
    return data.budgetMin >= 1
  }
  return true
}, {
  message: 'Orçamento mínimo deve ser pelo menos 1€',
  path: ['budgetMin']
})

// Schema de validação para proposta de serviço
export const serviceProposalSchema = z.object({
  requestId: z.string().min(1, 'ID da solicitação é obrigatório'),
  price: z.number()
    .min(0.01, 'Preço deve ser maior que zero')
    .max(100000, 'Preço muito alto'),
  description: z.string()
    .min(20, 'Descrição deve ter pelo menos 20 caracteres')
    .max(1000, 'Descrição muito longa'),
  estimatedTime: z.string()
    .min(1, 'Tempo estimado é obrigatório')
    .max(100, 'Tempo estimado muito longo'),
  specialties: z.array(z.enum(PORTUGUESE_SPECIALTIES as [string, ...string[]]))
    .min(1, 'Pelo menos uma especialidade é obrigatória')
    .max(5, 'Máximo 5 especialidades'),
})

// Schema de validação para avaliação
export const reviewSchema = z.object({
  professionalId: z.string().min(1, 'ID do profissional é obrigatório'),
  requestId: z.string().optional(),
  rating: z.number()
    .int('Avaliação deve ser um número inteiro')
    .min(1, 'Avaliação deve ser pelo menos 1 estrela')
    .max(5, 'Avaliação deve ser no máximo 5 estrelas'),
  comment: z.string()
    .max(500, 'Comentário muito longo')
    .optional(),
})

// Schema de validação para especialidades de profissionais
export const professionalSpecialtiesSchema = z.object({
  specialties: z.array(z.enum(PORTUGUESE_SPECIALTIES as [string, ...string[]]))
    .min(1, 'Pelo menos uma especialidade é obrigatória')
    .max(10, 'Máximo 10 especialidades'),
  experience: z.string()
    .min(10, 'Experiência deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição de experiência muito longa'),
})

// Schema de validação para status de serviços
export const serviceStatusSchema = z.object({
  status: z.enum(SERVICE_STATUS as [string, ...string[]], {
    errorMap: () => ({ message: 'Status deve ser um status válido' })
  }),
  reason: z.string().max(200, 'Motivo muito longo').optional(),
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

// Exportar listas para uso em componentes
export { PORTUGUESE_DISTRICTS, PORTUGUESE_SPECIALTIES, SERVICE_STATUS }

// Função para validar telefone português
export function validatePortuguesePhone(phone: string): boolean {
  return /^9[0-9]{8}$/.test(phone)
}

// Função para validar código postal português
export function validatePortuguesePostalCode(postalCode: string): boolean {
  return /^\d{4}-\d{3}$/.test(postalCode)
}

// Função para validar email português (domínios .pt)
export function validatePortugueseEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const portugueseDomainRegex = /\.pt$/i
  return emailRegex.test(email) && portugueseDomainRegex.test(email)
}
