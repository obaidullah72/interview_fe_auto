/**
 * Convert WebM audio blob to WAV format using Web Audio API
 * This avoids the need for ffmpeg on the backend
 */
export const convertWebMToWAV = async (webmBlob) => {
  return new Promise((resolve, reject) => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Create file reader
      const fileReader = new FileReader()
      
      fileReader.onload = async (e) => {
        try {
          console.log('Decoding audio data...', e.target.result.byteLength, 'bytes')
          
          // Decode audio data
          const audioBuffer = await audioContext.decodeAudioData(e.target.result)
          
          console.log('Audio decoded:', {
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate,
            numberOfChannels: audioBuffer.numberOfChannels,
            length: audioBuffer.length
          })
          
          // Convert to WAV
          const wavArrayBuffer = audioBufferToWav(audioBuffer)
          console.log('WAV ArrayBuffer created:', wavArrayBuffer.byteLength, 'bytes')
          
          // Create a proper WAV blob with correct MIME type
          const wavBlob = new Blob([wavArrayBuffer], { 
            type: 'audio/wav'
          })
          
          console.log('WAV Blob created:', wavBlob.size, 'bytes, type:', wavBlob.type)
          
          resolve(wavBlob)
        } catch (error) {
          console.error('Error in audio conversion:', error)
          reject(new Error(`Failed to convert audio: ${error.message}`))
        }
      }
      
      fileReader.onerror = (error) => {
        console.error('FileReader error:', error)
        reject(new Error('Failed to read audio file'))
      }
      
      fileReader.readAsArrayBuffer(webmBlob)
    } catch (error) {
      console.error('Error setting up audio conversion:', error)
      reject(new Error(`Failed to initialize audio conversion: ${error.message}`))
    }
  })
}

/**
 * Convert AudioBuffer to WAV ArrayBuffer
 */
function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const format = 1 // PCM
  const bitDepth = 16
  
  const length = buffer.length * numChannels * 2 + 44
  const arrayBuffer = new ArrayBuffer(length)
  const view = new DataView(arrayBuffer)
  const samples = new Float32Array(buffer.length * numChannels)
  
  // Interleave samples
  let sampleOffset = 0
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      samples[sampleOffset++] = buffer.getChannelData(channel)[i]
    }
  }
  
  // Write WAV header
  const writeString = (byteOffset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(byteOffset + i, string.charCodeAt(i))
    }
  }
  
  writeString(0, 'RIFF')
  view.setUint32(4, length - 8, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // fmt chunk size
  view.setUint16(20, format, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numChannels * 2, true) // byte rate
  view.setUint16(32, numChannels * 2, true) // block align
  view.setUint16(34, bitDepth, true)
  writeString(36, 'data')
  view.setUint32(40, length - 44, true)
  
  // Convert float samples to 16-bit PCM
  let byteOffset = 44
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(byteOffset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
    byteOffset += 2
  }
  
  return arrayBuffer
}
