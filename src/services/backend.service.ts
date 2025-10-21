import type { Marker } from '../stores/modules'

export class BackendService {
  private readonly STORAGE_KEY = 'markers'

  async getMarkers(): Promise<Marker[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(this.STORAGE_KEY)
        resolve(data ? JSON.parse(data) : [])
      }, 100)
    })
  }

  async saveMarkers(markers: Marker[]): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(markers))
        resolve()
      }, 100)
    })
  }
}

export const backendService = new BackendService()
