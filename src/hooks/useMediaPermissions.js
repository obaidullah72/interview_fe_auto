import { useState, useRef, useEffect } from 'react'

const STORAGE_KEY = 'mediaPermissionsGranted'

export const useMediaPermissions = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const mediaStreamRef = useRef(null)

  const requestPermissions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      mediaStreamRef.current = stream
      setPermissionsGranted(true)
      try {
        window.localStorage.setItem(STORAGE_KEY, 'true')
      } catch (e) {
        // ignore storage errors
      }
    } catch (err) {
      setError(err.message)
      console.error('Error accessing media devices:', err)

      // If the user denied permanently, remember not to auto-request next time
      try {
        if (err && err.name === 'NotAllowedError') {
          window.localStorage.setItem(STORAGE_KEY, 'denied')
        }
      } catch (e) {
        // ignore storage errors
      }
    } finally {
      setIsLoading(false)
    }
  }

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
      setPermissionsGranted(false)
      // do NOT clear localStorage here so we don't ask again next visit
    }
  }

  useEffect(() => {
    // On mount, if we previously granted permissions, try to get media immediately
    let shouldAutoRequest = false
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      shouldAutoRequest = stored === 'true'
    } catch (e) {
      shouldAutoRequest = false
    }

    if (shouldAutoRequest) {
      requestPermissions()
    }

    return () => {
      stopMediaStream()
    }
  }, [])

  return {
    permissionsGranted,
    isLoading,
    error,
    requestPermissions,
    stopMediaStream,
    mediaStream: mediaStreamRef.current,
  }
}
