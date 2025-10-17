'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

interface AddressSuggestion {
  display_name: string
  address: {
    house_number?: string
    road?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
    county?: string
    state?: string
    postcode?: string
    country?: string
  }
  lat: string
  lon: string
}

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onAddressSelect: (address: {
    morada: string
    district: string
    council: string
    parish: string
    postalCode: string
  }) => void
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
  error?: string
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Digite sua morada...",
  className = "",
  label,
  required = false,
  error
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounce para evitar muitas requisições
  useEffect(() => {
    if (value.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timeoutId = setTimeout(() => {
      searchAddresses(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [value])

  const searchAddresses = async (query: string) => {
    if (query.length < 3) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(query)}&` +
        `countrycodes=pt&` +
        `limit=5&` +
        `addressdetails=1&` +
        `extratags=1`
      )

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
        setShowSuggestions(true)
        setSelectedIndex(-1)
      }
    } catch (error) {
      console.error('Erro ao buscar endereços:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    const address = suggestion.address
    const displayName = suggestion.display_name

    // Extrair informações do endereço - apenas rua/nome da via
    const morada = address.road || address.suburb || displayName.split(',')[0] || ''

    const district = address.state || address.county || ''
    const council = address.city || address.town || address.village || ''
    const parish = address.village || address.town || ''
    const postalCode = address.postcode || ''

    // Atualizar o campo de morada
    onChange(morada)

    // Preencher os outros campos
    onAddressSelect({
      morada,
      district,
      council,
      parish,
      postalCode
    })

    // Fechar sugestões e limpar
    setShowSuggestions(false)
    setSuggestions([])
    setSelectedIndex(-1)
    
    // Focar no próximo campo (número da casa)
    setTimeout(() => {
      const nextInput = document.querySelector('input[placeholder*="número"]') as HTMLInputElement
      if (nextInput) {
        nextInput.focus()
      }
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleAddressSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay para permitir cliques nas sugestões
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }, 150)
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
            error ? 'border-red-500' : ''
          } ${className}`}
          autoComplete="off"
        />
        
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.lat}-${suggestion.lon}`}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleAddressSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">
                    {suggestion.display_name}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {suggestion.address.postcode && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {suggestion.address.postcode}
                      </span>
                    )}
                    {suggestion.address.city && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {suggestion.address.city}
                      </span>
                    )}
                    {suggestion.address.state && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {suggestion.address.state}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
