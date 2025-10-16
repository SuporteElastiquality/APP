// Tipos para localização
export interface LocationData {
  district: string
  council: string
  parish: string
  address?: string
  postalCode?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

// Cache para evitar muitas chamadas à API
const locationCache = new Map<string, LocationData>()

// Função para obter localização atual do usuário
export async function getCurrentLocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocalização não suportada pelo navegador')
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const location = await reverseGeocode(latitude, longitude)
          resolve(location)
        } catch (error) {
          console.error('Erro ao obter localização:', error)
          resolve(null)
        }
      },
      (error) => {
        console.warn('Erro de geolocalização:', error.message)
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    )
  })
}

// Função para geocodificação reversa (coordenadas -> endereço)
async function reverseGeocode(latitude: number, longitude: number): Promise<LocationData | null> {
  const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`
  
  // Verificar cache primeiro
  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey)!
  }

  try {
    // Usar API de geocodificação reversa (Nominatim - OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=pt`
    )
    
    if (!response.ok) {
      throw new Error('Erro na API de geocodificação')
    }

    const data = await response.json()
    
    if (!data.address) {
      throw new Error('Endereço não encontrado')
    }

    const location: LocationData = {
      district: data.address.state || data.address.county || 'Lisboa',
      council: data.address.city || data.address.town || data.address.village || 'Lisboa',
      parish: data.address.suburb || data.address.neighbourhood || data.address.hamlet || 'Lisboa',
      address: data.display_name,
      postalCode: data.address.postcode || '',
      coordinates: { latitude, longitude }
    }

    // Salvar no cache
    locationCache.set(cacheKey, location)
    
    return location
  } catch (error) {
    console.error('Erro na geocodificação reversa:', error)
    return null
  }
}

// Função para buscar localizações por nome (autocomplete)
export async function searchLocations(query: string): Promise<LocationData[]> {
  if (!query || query.length < 3) {
    return []
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=pt&addressdetails=1&limit=5&accept-language=pt`
    )
    
    if (!response.ok) {
      throw new Error('Erro na API de busca')
    }

    const data = await response.json()
    
    return data.map((item: any) => ({
      district: item.address?.state || item.address?.county || 'Lisboa',
      council: item.address?.city || item.address?.town || item.address?.village || 'Lisboa',
      parish: item.address?.suburb || item.address?.neighbourhood || item.address?.hamlet || 'Lisboa',
      address: item.display_name,
      postalCode: item.address?.postcode || '',
      coordinates: {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }
    }))
  } catch (error) {
    console.error('Erro na busca de localizações:', error)
    return []
  }
}

// Função para validar se a localização é em Portugal
export function isValidPortugueseLocation(location: LocationData): boolean {
  const portugueseDistricts = [
    'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 'Évora',
    'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre', 'Porto', 'Santarém',
    'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu', 'Açores', 'Madeira'
  ]
  
  return portugueseDistricts.some(district => 
    location.district.toLowerCase().includes(district.toLowerCase())
  )
}

// Hook para usar geolocalização em componentes React
export function useGeolocation() {
  const [location, setLocation] = React.useState<LocationData | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const getLocation = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const currentLocation = await getCurrentLocation()
      if (currentLocation && isValidPortugueseLocation(currentLocation)) {
        setLocation(currentLocation)
      } else {
        setError('Localização não encontrada em Portugal')
      }
    } catch (err) {
      setError('Erro ao obter localização')
    } finally {
      setLoading(false)
    }
  }

  return { location, loading, error, getLocation }
}

// Importar React para o hook
import React from 'react'
