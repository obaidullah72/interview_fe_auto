import { useState, useRef, useEffect, useCallback } from 'react'

// Heuristic helpers to guess gender from voice name
const looksFemale = (name = '') => {
  const n = name.toLowerCase()
  return (
    n.includes('female') ||
    n.includes('woman') ||
    n.includes('girl') ||
    n.includes('zira') ||
    n.includes('aria') ||
    n.includes('salli') ||
    n.includes('emma') ||
    n.includes('amy') ||
    n.includes('karen') ||
    n.includes('samantha') ||
    n.includes('victoria') ||
    n.includes('susan') ||
    n.includes('kate') ||
    n.includes('fiona') ||
    n.includes('veena') ||
    n.includes('tessa') ||
    n.includes('nicole') ||
    n.includes('helen') ||
    n.includes('linda') ||
    n.includes('sarah')
  )
}

const looksMale = (name = '') => {
  const n = name.toLowerCase()
  return (
    n.includes('male') ||
    n.includes('man') ||
    n.includes('boy') ||
    n.includes('george') ||
    n.includes('brian') ||
    n.includes('ryan') ||
    n.includes('justin') ||
    n.includes('david') ||
    n.includes('alex') ||
    n.includes('daniel') ||
    n.includes('fred') ||
    n.includes('ralph') ||
    n.includes('tom') ||
    n.includes('lee') ||
    n.includes('sanjay') ||
    n.includes('ravi') ||
    n.includes('raja') ||
    n.includes('rishi') ||
    n.includes('james') ||
    n.includes('john') ||
    n.includes('mark') ||
    n.includes('paul')
  )
}

// Check if voice is high quality/premium
const isHighQualityVoice = (voice) => {
  const name = (voice.name || '').toLowerCase()
  const lang = (voice.lang || '').toLowerCase()
  
  // Prefer English voices
  if (!lang.startsWith('en')) return false
  
  // Prefer local/default voices (usually clearer)
  if (voice.default) return true
  
  // Prefer known high-quality voice providers
  return (
    name.includes('google') ||
    name.includes('microsoft') ||
    name.includes('samantha') ||
    name.includes('alex') ||
    name.includes('karen') ||
    name.includes('daniel') ||
    name.includes('susan') ||
    name.includes('victoria') ||
    name.includes('kate') ||
    name.includes('fiona') ||
    name.includes('tessa') ||
    name.includes('nicole')
  )
}

export const useSpeechPlayer = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceProfiles, setVoiceProfiles] = useState([]) // [{ id, label, voiceIndex }]

  const synthRef = useRef(null)
  const voicesRef = useRef([])
  const voiceProfilesRef = useRef([])

  useEffect(() => {
    const synth = window.speechSynthesis
    synthRef.current = synth

    const buildProfiles = (voices) => {
      if (!voices || !voices.length) {
        setVoiceProfiles([])
        voiceProfilesRef.current = []
        return
      }

      // Filter for English voices first
      const englishVoices = voices.filter(v => {
        const lang = (v.lang || '').toLowerCase()
        return lang.startsWith('en')
      })
      
      const voicesToSearch = englishVoices.length > 0 ? englishVoices : voices

      // Separate voices by gender and quality
      const femaleVoices = []
      const maleVoices = []

      voicesToSearch.forEach((voice, idx) => {
        const originalIndex = voices.indexOf(voice)
        const isHighQuality = isHighQualityVoice(voice)
        
        if (looksFemale(voice.name)) {
          femaleVoices.push({
            voiceIndex: originalIndex,
            voice: voice,
            isHighQuality: isHighQuality,
            isDefault: voice.default || false,
          })
        } else if (looksMale(voice.name)) {
          maleVoices.push({
            voiceIndex: originalIndex,
            voice: voice,
            isHighQuality: isHighQuality,
            isDefault: voice.default || false,
          })
        }
      })

      // Sort: prefer high-quality and default voices
      const sortVoices = (a, b) => {
        if (a.isDefault && !b.isDefault) return -1
        if (!a.isDefault && b.isDefault) return 1
        if (a.isHighQuality && !b.isHighQuality) return -1
        if (!a.isHighQuality && b.isHighQuality) return 1
        return 0
      }

      femaleVoices.sort(sortVoices)
      maleVoices.sort(sortVoices)

      const profiles = []

      // Create voice-1 (female) - use best quality voice
      if (femaleVoices.length > 0) {
        profiles.push({
          id: 'voice-1',
          label: '1',
          voiceIndex: femaleVoices[0].voiceIndex,
        })
      }

      // Create voice-2 (male) - use best quality voice
      if (maleVoices.length > 0) {
        profiles.push({
          id: 'voice-2',
          label: '2',
          voiceIndex: maleVoices[0].voiceIndex,
        })
      }

      setVoiceProfiles(profiles)
      voiceProfilesRef.current = profiles
    }

    const loadVoices = () => {
      const voices = synth.getVoices() || []
      voicesRef.current = voices
      buildProfiles(voices)
    }

    loadVoices()
    synth.addEventListener('voiceschanged', loadVoices)

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      synth.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  const speak = useCallback((text, options = {}) => {
    if (!synthRef.current || !text) return

    synthRef.current.cancel()
    setIsSpeaking(true)

    const utterance = new SpeechSynthesisUtterance(text)

    // Use voiceProfileId to look up profile and set voice by voiceIndex
    if (options.voiceProfileId && voiceProfilesRef.current.length && voicesRef.current.length) {
      const profile = voiceProfilesRef.current.find(p => p.id === options.voiceProfileId)
      if (profile && typeof profile.voiceIndex === 'number' && voicesRef.current[profile.voiceIndex]) {
        utterance.voice = voicesRef.current[profile.voiceIndex]
      }
    }

    // Fallback: numeric index
    if (!utterance.voice && typeof options.voiceIndex === 'number' && voicesRef.current.length > 0) {
      const idx = ((options.voiceIndex % voicesRef.current.length) + voicesRef.current.length) % voicesRef.current.length
      utterance.voice = voicesRef.current[idx]
    }

    // Optimize for clarity: rate 1.0 is clearer than 0.95
    utterance.rate = options.rate !== undefined ? options.rate : 1.0
    utterance.pitch = options.pitch !== undefined ? options.pitch : 1.0
    utterance.volume = options.volume !== undefined ? options.volume : 1.0
    
    // Ensure lang is set for better clarity
    if (utterance.voice && utterance.voice.lang) {
      utterance.lang = utterance.voice.lang
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    synthRef.current.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return {
    isSpeaking,
    speak,
    stop,
    voiceProfiles,
  }
}
