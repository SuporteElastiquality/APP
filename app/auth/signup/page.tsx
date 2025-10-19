'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import LocationInput from '@/components/LocationInput'
import CategoryServiceSelector from '@/components/CategoryServiceSelector'
import WorkDistrictsSelector from '@/components/WorkDistrictsSelector'
import { LocationData } from '@/lib/geolocation'

const portugueseDistricts = [
  { value: 'lisboa', label: 'Lisboa' },
  { value: 'porto', label: 'Porto' },
  { value: 'braga', label: 'Braga' },
  { value: 'coimbra', label: 'Coimbra' },
  { value: 'aveiro', label: 'Aveiro' },
  { value: 'faro', label: 'Faro' },
  { value: 'leiria', label: 'Leiria' },
  { value: 'santarem', label: 'Santarém' },
  { value: 'viseu', label: 'Viseu' },
  { value: 'setubal', label: 'Setúbal' },
  { value: 'viana-do-castelo', label: 'Viana do Castelo' },
  { value: 'vila-real', label: 'Vila Real' },
  { value: 'guarda', label: 'Guarda' },
  { value: 'castelo-branco', label: 'Castelo Branco' },
  { value: 'evora', label: 'Évora' },
  { value: 'beja', label: 'Beja' },
  { value: 'portalegre', label: 'Portalegre' },
  { value: 'azores', label: 'Açores' },
  { value: 'madeira', label: 'Madeira' }
]

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'CLIENT' as 'CLIENT' | 'PROFESSIONAL',
    district: '',
    council: '',
    parish: '',
    specialties: '',
    experience: '',
    workDistricts: [] as string[],
    categories: [] as string[],
    services: [] as string[]
  })
  const [locationString, setLocationString] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validar senhas
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem')
        setLoading(false)
        return
      }

      // Criar usuário
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Fazer login automático
        await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })
        router.push('/dashboard')
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao criar conta')
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    signIn('google', { callbackUrl: '/auth/google-signup' })
  }

  const nextStep = () => {
    if (step === 1 && formData.firstName && formData.lastName && formData.email && formData.password && formData.confirmPassword) {
      setStep(2)
    } else if (step === 2 && formData.userType === 'CLIENT' && formData.phone && formData.district && formData.council && formData.parish) {
      setStep(3)
    } else if (step === 2 && formData.userType === 'PROFESSIONAL' && formData.phone && formData.district && formData.council && formData.parish && formData.workDistricts.length > 0 && formData.categories.length > 0 && formData.services.length > 0) {
      setStep(3)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  // Função para lidar com seleção de localização
  const handleLocationSelect = (location: LocationData) => {
    // Extrair informações de localização do endereço
    const address = location.address || {}
    const district = address.state || address.county || ''
    const council = address.city || address.town || address.village || ''
    const parish = address.village || address.town || ''
    
    setFormData({
      ...formData,
      district,
      council,
      parish
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Elastiquality"
            width={200}
            height={100}
            className="w-50 h-25 object-contain"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link
            href="/auth/signin"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            entre na sua conta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Seu nome"
                    required
                  />

                  <Input
                    label="Apelido"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Seu apelido"
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />

                <div className="relative">
                  <Input
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirmar senha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Digite a senha novamente"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full"
                  disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword}
                >
                  Continuar
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sou um...
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, userType: 'CLIENT' })}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        formData.userType === 'CLIENT'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">Cliente</div>
                      <div className="text-sm text-gray-600">Preciso de serviços</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, userType: 'PROFESSIONAL' })}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        formData.userType === 'PROFESSIONAL'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">Profissional</div>
                      <div className="text-sm text-gray-600">Ofereço serviços</div>
                    </button>
                  </div>
                </div>

                <Input
                  label="Telefone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="912 345 678"
                  required
                  helperText="Formato português: 9 dígitos"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização
                  </label>
                  <LocationInput
                    value={locationString}
                    onChange={setLocationString}
                    onLocationSelect={handleLocationSelect}
                    placeholder="Digite sua localização ou use a localização atual"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Digite sua localização ou clique no ícone de localização para usar sua posição atual
                  </p>
                </div>

                {/* Campos de localização preenchidos automaticamente */}
                {formData.district && formData.council && formData.parish && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>Localização detectada:</strong> {formData.parish}, {formData.council}, {formData.district}
                    </p>
                  </div>
                )}

                {/* Campos ocultos para envio do formulário */}
                <input type="hidden" name="district" value={formData.district} />
                <input type="hidden" name="council" value={formData.council} />
                <input type="hidden" name="parish" value={formData.parish} />

                {formData.userType === 'PROFESSIONAL' && (
                  <>
                    <WorkDistrictsSelector
                      selectedDistricts={formData.workDistricts}
                      onDistrictsChange={(districts) => setFormData({ ...formData, workDistricts: districts })}
                    />

                    <CategoryServiceSelector
                      selectedCategories={formData.categories}
                      selectedServices={formData.services}
                      onCategoriesChange={(categories) => setFormData({ ...formData, categories })}
                      onServicesChange={(services) => setFormData({ ...formData, services })}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experiência
                      </label>
                      <textarea
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="Conte-nos sobre sua experiência profissional..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                        rows={4}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1"
                    disabled={
                      formData.userType === 'CLIENT' 
                        ? !formData.phone || !formData.district || !formData.council || !formData.parish
                        : !formData.phone || !formData.district || !formData.council || !formData.parish || 
                          formData.workDistricts.length === 0 || formData.categories.length === 0 || formData.services.length === 0
                    }
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Verificação de Conta
                  </h3>
                  <p className="text-gray-600">
                    Para garantir a segurança da sua conta, precisamos verificar seu email e telefone.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-blue-900">
                          Verificação de Email
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Enviamos um link de verificação para <strong>{formData.email}</strong>
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Verifique sua caixa de entrada e spam. O link expira em 24 horas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-green-900">
                          Verificação de Telefone
                        </h4>
                        <p className="text-sm text-green-700 mt-1">
                          Enviamos um código SMS para <strong>{formData.phone}</strong>
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Digite o código de 6 dígitos que recebeu por SMS.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Após verificar seu email e telefone, sua conta estará ativa e você poderá começar a usar a plataforma.
                  </p>
                  
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        // Aqui seria implementada a lógica de verificação
                        // Por enquanto, vamos redirecionar para o dashboard
                        router.push('/dashboard')
                      }}
                      className="flex-1"
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
