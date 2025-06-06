import { API_CONFIG } from './config'

// Hàm lấy token từ localStorage (nếu có)
function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(API_CONFIG.tokenKey)
}

// Hàm tạo headers cho request
function getHeaders(isJson = true): HeadersInit {
  const headers: HeadersInit = {}
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (isJson) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

// Hàm GET
export async function get<T>(endpoint: string): Promise<T> {
  try {
    const res = await fetch(`${API_CONFIG.baseUrl}/${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    })
    
    if (!res.ok) {
      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem(API_CONFIG.tokenKey)
        localStorage.removeItem('user')
        throw new Error('Phiên đăng nhập đã hết hạn')
      }
      throw new Error(await res.text())
    }
    return res.json()
  } catch (error) {
    console.error('GET request failed:', error)
    throw error
  }
}

// Hàm POST
export async function post<T>(endpoint: string, data?: any): Promise<T> {
  try {
    const res = await fetch(`${API_CONFIG.baseUrl}/${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include'
    })
    
    if (!res.ok) {
      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem(API_CONFIG.tokenKey)
        localStorage.removeItem('user')
        throw new Error('Phiên đăng nhập đã hết hạn')
      }
      throw new Error(await res.text())
    }
    return res.json()
  } catch (error) {
    console.error('POST request failed:', error)
    throw error
  }
}

// Hàm PUT
export async function put<T>(endpoint: string, data?: any): Promise<T> {
  try {
    const res = await fetch(`${API_CONFIG.baseUrl}/${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include'
    })
    
    if (!res.ok) {
      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem(API_CONFIG.tokenKey)
        localStorage.removeItem('user')
        throw new Error('Phiên đăng nhập đã hết hạn')
      }
      throw new Error(await res.text())
    }
    return res.json()
  } catch (error) {
    console.error('PUT request failed:', error)
    throw error
  }
}

// Hàm DELETE
export async function del<T>(endpoint: string): Promise<T> {
  try {
    const res = await fetch(`${API_CONFIG.baseUrl}/${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    })
    
    if (!res.ok) {
      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem(API_CONFIG.tokenKey)
        localStorage.removeItem('user')
        throw new Error('Phiên đăng nhập đã hết hạn')
      }
      throw new Error(await res.text())
    }
    return res.json()
  } catch (error) {
    console.error('DELETE request failed:', error)
    throw error
  }
}