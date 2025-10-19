'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import Button from '@/components/Button'
import { X, Filter } from 'lucide-react'

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  brands: string[]
  categories: string[]
}

interface FilterState {
  priceRange: [number, number]
  brands: string[]
  categories: string[]
  inStock: boolean
  rating: number
}

export default function ProductFilters({ onFiltersChange, brands, categories }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    brands: [],
    categories: [],
    inStock: false,
    rating: 0
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      priceRange: [0, 1000],
      brands: [],
      categories: [],
      inStock: false,
      rating: 0
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = 
    filters.brands.length + 
    filters.categories.length + 
    (filters.inStock ? 1 : 0) + 
    (filters.rating > 0 ? 1 : 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden"
            >
              {isExpanded ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Content */}
      <div className={`p-4 space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Preço */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Preço</h4>
          <div className="space-y-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>€{filters.priceRange[0]}</span>
              <span>€{filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Marca */}
        {brands.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Marca</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map(brand => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('brands', [...filters.brands, brand])
                      } else {
                        updateFilter('brands', filters.brands.filter(b => b !== brand))
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Categoria */}
        {categories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Categoria</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map(category => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter('categories', [...filters.categories, category])
                      } else {
                        updateFilter('categories', filters.categories.filter(c => c !== category))
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Disponibilidade */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Disponibilidade</h4>
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilter('inStock', checked)}
            />
            <span className="text-sm text-gray-700">Apenas em stock</span>
          </label>
        </div>

        {/* Avaliação */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Avaliação</h4>
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => 
                    updateFilter('rating', checked ? rating : 0)
                  }
                />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-700 ml-1">e acima</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
