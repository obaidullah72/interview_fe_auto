import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Custom hook for speech-to-text transcription using Web Speech API
 */
export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const interimTranscriptRef = useRef('')
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    // Initialize recognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      interimTranscriptRef.current = ''
      finalTranscriptRef.current = ''
    }

    recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      interimTranscriptRef.current = interimTranscript
      setTranscript(prev => {
        const newTranscript = prev + finalTranscript
        finalTranscriptRef.current = newTranscript.trim()
        return newTranscript.trim()
      })
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.')
          break
        case 'audio-capture':
          setError('No microphone found. Please check your microphone settings.')
          break
        case 'not-allowed':
          setError('Microphone permission denied. Please allow microphone access in your browser settings.')
          break
        default:
          setError(`Speech recognition error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    }
  }, [])

  const startListening = useCallback(() => {
    // If the Web Speech API wasn't available or init failed
    if (!recognitionRef.current) {
      setError('Speech recognition is not available. Please use a supported browser and allow microphone access.')
      return
    }

    // Avoid calling start() while already listening – this throws in some browsers
    if (isListening) {
      return
    }

    try {
      setTranscript('')
      setError(null)
      recognitionRef.current.start()
    } catch (err) {
      console.error('Error starting recognition:', err)

      // Some browsers throw if start() is called too quickly or in an invalid state.
      // In that case, fail gracefully instead of spamming a persistent error toast.
      if (err && err.name === 'InvalidStateError') {
        // Just ignore – recognition will already be running or will restart shortly.
        return
      }

      setError('Failed to start speech recognition. Please check microphone permissions and try again.')
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('Error stopping recognition:', err)
      }
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    interimTranscriptRef.current = ''
    finalTranscriptRef.current = ''
  }, [])

  const getFinalTranscript = useCallback(() => {
    return finalTranscriptRef.current || transcript
  }, [transcript])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
    getFinalTranscript,
    clearError,
  }
}
