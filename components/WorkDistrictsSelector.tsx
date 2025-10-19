'use client'

import { useState } from 'react'
import { MapPin, X, Plus } from 'lucide-react'

interface WorkDistrictsSelectorProps {
  selectedDistricts: string[]
  onDistrictsChange: (districts: string[]) => void
  disabled?: boolean
}

const PORTUGUESE_DISTRICTS = [
  'Aveiro',
  'Beja',
  'Braga',
  'Bragança',
  'Castelo Branco',
  'Coimbra',
  'Évora',
  'Faro',
  'Guarda',
  'Leiria',
  'Lisboa',
  'Portalegre',
  'Porto',
  'Santarém',
  'Setúbal',
  'Viana do Castelo',
  'Vila Real',
  'Viseu',
  'Açores',
  'Madeira'
]

export default function WorkDistrictsSelector({
  selectedDistricts,
  onDistrictsChange,
  disabled = false
}: WorkDistrictsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDistricts = PORTUGUESE_DISTRICTS.filter(district =>
    district.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDistrictToggle = (district: string) => {
    if (disabled) return
    
    const newDistricts = selectedDistricts.includes(district)
      ? selectedDistricts.filter(d => d !== district)
      : [...selectedDistricts, district]
    
    onDistrictsChange(newDistricts)
  }

  const removeDistrict = (district: string) => {
    if (disabled) return
    onDistrictsChange(selectedDistricts.filter(d => d !== district))
  }

  const clearAll = () => {
    if (disabled) return
    onDistrictsChange([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Distritos de Trabalho
        </h3>
        {selectedDistricts.length > 0 && (
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

      {/* Distritos selecionados */}
      {selectedDistricts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDistricts.map((district) => (
            <div
              key={district}
              className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <MapPin className="h-4 w-4" />
              <span>{district}</span>
              <button
                type="button"
                onClick={() => removeDistrict(district)}
                disabled={disabled}
                className="hover:text-blue-600 disabled:opacity-50"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Seletor de distritos */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">
              {selectedDistricts.length === 0 
                ? 'Selecionar distritos onde trabalha' 
                : `Adicionar mais distritos (${selectedDistricts.length} selecionados)`
              }
            </span>
          </div>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Buscar distrito..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredDistricts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhum distrito encontrado
                </div>
              ) : (
                filteredDistricts.map((district) => (
                  <button
                    key={district}
                    type="button"
                    onClick={() => handleDistrictToggle(district)}
                    disabled={disabled}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50 ${
                      selectedDistricts.includes(district) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDistricts.includes(district)}
                      onChange={() => {}}
                      disabled={disabled}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{district}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Informação adicional */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          <strong>💡 Dica:</strong> Selecione todos os distritos onde está disposto a trabalhar. 
          Isso ajudará os clientes a encontrá-lo mais facilmente.
        </p>
      </div>
    </div>
  )
}
