const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const authApi = {
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || Object.values(error).flat().join(', ') || 'Registration failed')
    }

    return response.json()
  },

  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    return response.json()
  },

  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    return response.json()
  },

  async updateProfile(token, userData) {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update profile')
    }

    return response.json()
  },
}
