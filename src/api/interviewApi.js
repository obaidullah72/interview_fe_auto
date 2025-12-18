const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const getAuthHeaders = (token) => {
  const headers = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const interviewApi = {
  async getQuestions(token) {
    const response = await fetch(`${API_BASE_URL}/questions/`, {
      headers: getAuthHeaders(token),
    })
    if (!response.ok) {
      throw new Error('Failed to fetch questions')
    }
    return response.json()
  },

  async getQuestion(questionNumber, token) {
    const response = await fetch(`${API_BASE_URL}/questions/${questionNumber}/`, {
      headers: getAuthHeaders(token),
    })
    if (!response.ok) {
      throw new Error('Failed to fetch question')
    }
    return response.json()
  },

  async createSession(token) {
    const response = await fetch(`${API_BASE_URL}/sessions/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(token),
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create session')
    }

    return response.json()
  },

  async getSessions(token) {
    const response = await fetch(`${API_BASE_URL}/sessions/`, {
      headers: getAuthHeaders(token),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch sessions')
    }

    return response.json()
  },

  async getSession(sessionId, token) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/`, {
      headers: getAuthHeaders(token),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch session')
    }

    return response.json()
  },

  async completeSession(sessionId, token) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(token),
      },
      body: JSON.stringify({ is_completed: true }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to complete session')
    }

    return response.json()
  },

  async deleteSession(sessionId, token) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || 'Failed to delete session')
    }

    return response.json().catch(() => ({}))
  },

  async transcribeAudio(audioBlob, questionNumber, questionText, token) {
    try {
      const formData = new FormData()

      // Ensure we have a valid blob
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Invalid audio blob: empty or null')
      }

      // Create a new File object to ensure proper filename and type
      const wavFile = new File([audioBlob], 'recording.wav', {
        type: 'audio/wav',
        lastModified: Date.now(),
      })

      console.log('Sending audio file:', {
        name: wavFile.name,
        size: wavFile.size,
        type: wavFile.type,
      })

      formData.append('audio', wavFile, 'recording.wav')
      formData.append('question_number', questionNumber.toString())
      formData.append('question_text', questionText)

      const response = await fetch(`${API_BASE_URL}/transcribe/`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: formData,
      })

      console.log('Transcription response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Transcription error:', errorData)
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Transcription success:', data)
      return data
    } catch (error) {
      console.error('Transcription API error:', error)
      throw error
    }
  },

  async completeInterview(answers, token) {
    const response = await fetch(`${API_BASE_URL}/sessions/complete/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(token),
      },
      body: JSON.stringify({ answers }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to complete interview')
    }

    return response.json()
  },

  async getAnswers(token, sessionId = null) {
    const url = sessionId
      ? `${API_BASE_URL}/answers/?session_id=${sessionId}`
      : `${API_BASE_URL}/answers/`

    const response = await fetch(url, {
      headers: getAuthHeaders(token),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch answers')
    }

    return response.json()
  },
}

