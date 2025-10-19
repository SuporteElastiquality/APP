'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: string
  services: Service[]
}

interface Service {
  id: string
  name: string
  description: string
}

interface CategoryServiceSelectorProps {
  selectedCategories: string[]
  selectedServices: string[]
  onCategoriesChange: (categories: string[]) => void
  onServicesChange: (services: string[]) => void
  disabled?: boolean
}

export default function CategoryServiceSelector({
  selectedCategories,
  selectedServices,
  onCategoriesChange,
  onServicesChange,
  disabled = false
}: CategoryServiceSelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      
      // Agrupar serviços por categoria
      const categoriesMap = new Map<string, Category>()
      
      data.services.forEach((service: any) => {
        const categoryId = service.category.id
        const categoryName = service.category.name
        const categoryIcon = service.category.icon || '🔧'
        
        if (!categoriesMap.has(categoryId)) {
          categoriesMap.set(categoryId, {
            id: categoryId,
            name: categoryName,
            icon: categoryIcon,
            services: []
          })
        }
        
        categoriesMap.get(categoryId)!.services.push({
          id: service.id,
          name: service.name,
          description: service.description || ''
        })
      })
      
      setCategories(Array.from(categoriesMap.values()))
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    if (disabled) return
    
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    
    onCategoriesChange(newCategories)
    
    // Se desmarcar categoria, remover todos os serviços dessa categoria
    if (selectedCategories.includes(categoryId)) {
      const category = categories.find(c => c.id === categoryId)
      if (category) {
        const servicesToRemove = category.services.map(s => s.id)
        const newServices = selectedServices.filter(id => !servicesToRemove.includes(id))
        onServicesChange(newServices)
      }
    }
  }

  const handleServiceToggle = (serviceId: string, categoryId: string) => {
    if (disabled) return
    
    // Se selecionar serviço, garantir que a categoria também esteja selecionada
    if (!selectedCategories.includes(categoryId)) {
      onCategoriesChange([...selectedCategories, categoryId])
    }
    
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId]
    
    onServicesChange(newServices)
  }

  const isCategorySelected = (categoryId: string) => {
    return selectedCategories.includes(categoryId)
  }

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.includes(serviceId)
  }

  const getSelectedServicesCount = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return 0
    
    return category.services.filter(s => selectedServices.includes(s.id)).length
  }

  const clearAll = () => {
    if (disabled) return
    onCategoriesChange([])
    onServicesChange([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando categorias...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Categorias e Serviços
        </h3>
        {(selectedCategories.length > 0 || selectedServices.length > 0) && (
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            Limpar tudo
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {categories.map((category) => (
          <div key={category.id} className="border border-gray-200 rounded-lg">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedCategory(
                expandedCategory === category.id ? null : category.id
              )}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isCategorySelected(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  disabled={disabled}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-gray-900">{category.name}</span>
                {getSelectedServicesCount(category.id) > 0 && (
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {getSelectedServicesCount(category.id)} selecionado(s)
                  </span>
                )}
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  expandedCategory === category.id ? 'rotate-180' : ''
                }`}
              />
            </div>

            {expandedCategory === category.id && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {category.services.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-start space-x-3 p-2 rounded hover:bg-white cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isServiceSelected(service.id)}
                        onChange={() => handleServiceToggle(service.id, category.id)}
                        disabled={disabled}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {service.name}
                        </div>
                        {service.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {service.description}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumo das seleções */}
      {(selectedCategories.length > 0 || selectedServices.length > 0) && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Resumo das seleções:
          </h4>
          <div className="text-sm text-blue-800">
            <p>
              <strong>{selectedCategories.length}</strong> categoria(s) selecionada(s)
            </p>
            <p>
              <strong>{selectedServices.length}</strong> serviço(s) selecionado(s)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
