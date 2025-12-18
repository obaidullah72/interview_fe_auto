import { useState, useRef, useCallback } from 'react'
import { convertWebMToWAV } from '../utils/audioConverter'

export const useAudioRecorder = (mediaStream) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = useCallback(() => {
    if (!mediaStream) {
      throw new Error('Media stream not available')
    }

    const audioTracks = mediaStream.getAudioTracks()
    if (audioTracks.length === 0) {
      throw new Error('No audio track available')
    }

    const audioStream = new MediaStream(audioTracks)
    
    // Try to use WAV format first, fallback to WebM
    const options = { mimeType: 'audio/webm;codecs=opus' }
    if (MediaRecorder.isTypeSupported('audio/webm')) {
      options.mimeType = 'audio/webm;codecs=opus'
    }
    
    const mediaRecorder = new MediaRecorder(audioStream, options)

    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.start()
    setIsRecording(true)
  }, [mediaStream])

  const stopRecording = useCallback(async () => {
    return new Promise(async (resolve, reject) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = async () => {
          try {
            if (audioChunksRef.current.length === 0) {
              setIsRecording(false)
              setIsProcessing(false)
              reject(new Error('No audio data recorded'))
              return
            }

            const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
            console.log('WebM blob created:', webmBlob.size, 'bytes')
            
            // Convert WebM to WAV in browser (no ffmpeg needed)
            setIsProcessing(true)
            console.log('Starting audio conversion...')
            const wavBlob = await convertWebMToWAV(webmBlob)
            console.log('WAV conversion complete:', wavBlob.size, 'bytes', wavBlob.type)
            
            setIsRecording(false)
            setIsProcessing(false)
            resolve(wavBlob)
          } catch (error) {
            console.error('Error in stopRecording:', error)
          setIsRecording(false)
            setIsProcessing(false)
            reject(error)
          }
        }
        mediaRecorderRef.current.stop()
      } else {
        resolve(null)
      }
    })
  }, [isRecording])

  const reset = useCallback(() => {
    audioChunksRef.current = []
    setIsRecording(false)
    setIsProcessing(false)
  }, [])

  return {
    isRecording,
    isProcessing,
    setIsProcessing,
    startRecording,
    stopRecording,
    reset,
  }
}

