// Funções utilitárias para geolocalização e cálculo de distância

/**
 * Calcula a distância entre dois pontos geográficos usando a fórmula de Haversine
 * @param lat1 Latitude do primeiro ponto
 * @param lon1 Longitude do primeiro ponto
 * @param lat2 Latitude do segundo ponto
 * @param lon2 Longitude do segundo ponto
 * @returns Distância em quilômetros
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Raio da Terra em quilômetros
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return Math.round(distance * 100) / 100 // Arredondar para 2 casas decimais
}

/**
 * Converte graus para radianos
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Obtém coordenadas geográficas a partir de um endereço usando Nominatim (OpenStreetMap)
 * @param address Endereço completo
 * @returns Coordenadas {latitude, longitude} ou null se não encontrado
 */
export async function getCoordinatesFromAddress(address: string): Promise<{latitude: number, longitude: number} | null> {
  try {
    const encodedAddress = encodeURIComponent(address)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&countrycodes=pt&limit=1`
    )
    
    if (!response.ok) {
      throw new Error('Erro ao buscar coordenadas')
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      }
    }
    
    return null
  } catch (error) {
    console.error('Erro ao obter coordenadas:', error)
    return null
  }
}

/**
 * Obtém coordenadas geográficas a partir de distrito, conselho e freguesia
 * @param district Distrito
 * @param council Conselho
 * @param parish Freguesia
 * @returns Coordenadas {latitude, longitude} ou null se não encontrado
 */
export async function getCoordinatesFromLocation(
  district: string,
  council: string,
  parish: string
): Promise<{latitude: number, longitude: number} | null> {
  const fullAddress = `${parish}, ${council}, ${district}, Portugal`
  return getCoordinatesFromAddress(fullAddress)
}

/**
 * Filtra profissionais por proximidade geográfica
 * @param professionals Lista de profissionais
 * @param clientLatitude Latitude do cliente
 * @param clientLongitude Longitude do cliente
 * @param maxDistanceKm Distância máxima em quilômetros (padrão: 15km)
 * @returns Lista de profissionais dentro do raio especificado
 */
export function filterProfessionalsByDistance<T extends {
  id: string
  professionalProfile?: {
    latitude?: number | null
    longitude?: number | null
    district?: string
    council?: string
    parish?: string
  } | null
}>(
  professionals: T[],
  clientLatitude: number,
  clientLongitude: number,
  maxDistanceKm: number = 15
): T[] {
  return professionals.filter(professional => {
    const profile = professional.professionalProfile
    
    // Se tem coordenadas exatas, usar cálculo de distância
    if (profile?.latitude && profile?.longitude) {
      const distance = calculateDistance(
        clientLatitude,
        clientLongitude,
        profile.latitude,
        profile.longitude
      )
      return distance <= maxDistanceKm
    }
    
    // Se não tem coordenadas, assumir mesmo distrito (aproximadamente 15km)
    // Esta é uma aproximação - em produção seria melhor ter coordenadas exatas
    return true
  })
}

/**
 * Obtém a localização atual do usuário via geolocalização do navegador
 * @returns Promise com coordenadas ou null se não disponível
 */
export function getCurrentLocation(): Promise<{latitude: number, longitude: number} | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        console.error('Erro ao obter localização:', error)
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

// Tipos para LocationInput
export interface LocationData {
  display_name: string
  lat: string
  lon: string
  address?: {
    city?: string
    town?: string
    village?: string
    county?: string
    state?: string
    country?: string
  }
}

/**
 * Busca localizações usando Nominatim (OpenStreetMap)
 * @param query Termo de busca
 * @returns Lista de localizações encontradas
 */
export async function searchLocations(query: string): Promise<LocationData[]> {
  try {
    if (!query.trim()) return []
    
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&countrycodes=pt&limit=5&addressdetails=1`
    )
    
    if (!response.ok) {
      throw new Error('Erro ao buscar localizações')
    }
    
    const data = await response.json()
    return data.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
      address: item.address
    }))
  } catch (error) {
    console.error('Erro ao buscar localizações:', error)
    return []
  }
}