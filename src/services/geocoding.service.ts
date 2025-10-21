export interface Coordinates {
  lat: number
  lng: number
}

export class GeocodingService {
  private readonly API_URL = 'https://geocode.maps.co/reverse'

  async getAddress(coords: Coordinates): Promise<string> {
    try {
      const response = await fetch(
        `${this.API_URL}?lat=${coords.lat}&lon=${coords.lng}`
      )
      if (!response.ok) {
        throw new Error('Geocoding API error')
      }
      const data = await response.json()
      if (data.error) {
        throw new Error('Address not found')
      }
      return data.display_name || 'Address not found'
    } catch (error) {
      throw new Error('Failed to get address')
    }
  }
}
