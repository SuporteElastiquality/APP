'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Crosshair, Search } from 'lucide-react'
import { searchLocations, getCurrentLocation, LocationData } from '@/lib/geolocation'

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  onLocationSelect: (location: LocationData) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export default function LocationInput({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Onde está localizado?",
  required = false,
  className = ""
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<LocationData[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Buscar sugestões quando o usuário digita
  useEffect(() => {
    const searchLocation = async () => {
      if (value.length < 3) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoading(true)
      try {
        const results = await searchLocations(value)
        setSuggestions(results)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Erro ao buscar localizações:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchLocation, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [value])

  // Obter localização atual
  const handleGetCurrentLocation = async () => {
    setGettingLocation(true)
    try {
      const location = await getCurrentLocation()
      if (location) {
        // getCurrentLocation retorna apenas {latitude, longitude}
        // Vamos usar as coordenadas para buscar o endereço
        const locationString = `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`
        onChange(locationString)
        // Criar um LocationData básico para compatibilidade
        const locationData: LocationData = {
          display_name: locationString,
          lat: location.latitude.toString(),
          lon: location.longitude.toString()
        }
        onLocationSelect(locationData)
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Erro ao obter localização atual:', error)
    } finally {
      setGettingLocation(false)
    }
  }

  // Selecionar sugestão
  const handleSuggestionSelect = (location: LocationData) => {
    const locationString = `${location.parish}, ${location.council}, ${location.district}`
    onChange(locationString)
    onLocationSelect(location)
    setShowSuggestions(false)
  }

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length >= 3 && setShowSuggestions(true)}
          className={`w-full pl-10 pr-20 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 ${className}`}
          required={required}
        />
        
        {/* Botão de localização atual */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={gettingLocation}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-600 transition-colors disabled:opacity-50"
          title="Usar localização atual"
        >
          {gettingLocation ? (
            <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Crosshair className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Sugestões */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {loading ? (
            <div className="p-3 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <span>Buscando localizações...</span>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((location, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionSelect(location)}
                className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {location.parish}, {location.council}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {location.district}
                    </p>
                    {location.address && (
                      <p className="text-xs text-gray-400 truncate">
                        {location.address}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : value.length >= 3 ? (
            <div className="p-3 text-center text-gray-500">
              <Search className="w-4 h-4 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Nenhuma localização encontrada</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
