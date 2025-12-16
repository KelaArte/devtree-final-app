import { isAxiosError } from "axios";
import api from '../config/axios'
import type { User } from "../types";

export async function getUser() {
  try {
    const { data } = await api.get('/user')
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error en getUser')
    }
    throw error
  }
}

export async function updateProfile(formData: User) {
  try {
    const { data } = await api.patch<string>(`/user`, formData)
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const { data: { image } }: { data: { image: string } } = await api.post('/user/image', formData)
    return image
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

/**
 * Registra una visita al perfil de un usuario
 * @param handle - Handle del usuario a visitar
 */
export async function trackProfileVisit(handle: string) {
  try {
    const { data } = await api.post(`/user/${handle}/visit`)
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error al registrar visita')
    }
    throw error
  }
}

/**
 * Obtiene las estadísticas de visitas de un usuario
 * @param handle - Handle del usuario
 */
export async function getVisitStats(handle: string) {
  try {
    const { data } = await api.get(`/user/${handle}/stats`)
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error al obtener estadísticas')
    }
    throw error
  }
}

/**
 * Obtiene las estadísticas detalladas del usuario autenticado
 */
export async function getMyStats() {
  try {
    const { data } = await api.get('/user/my-stats')
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error al obtener mis estadísticas')
    }
    throw error
  }
}


export async function checkHandleAvailability(handle: string) {
  try {
    const { data } = await api.get('/auth/check-handle', { params: { handle } })
    // data = { available: boolean }
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error al comprobar handle')
    }
    throw error
  }
}