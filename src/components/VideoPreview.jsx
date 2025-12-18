import { useEffect, useRef, useState } from 'react'
import './VideoPreview.css'

const VideoPreview = ({ mediaStream, isRecording }) => {
  const videoRef = useRef(null)
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream
      
      // Get video track dimensions
      const videoTrack = mediaStream.getVideoTracks()[0]
      if (videoTrack) {
        const settings = videoTrack.getSettings()
        if (settings.width && settings.height) {
          setVideoDimensions({
            width: settings.width,
            height: settings.height
          })
        }
      }

      // Also listen for loadedmetadata to get actual video dimensions
      const handleLoadedMetadata = () => {
        if (videoRef.current) {
          setVideoDimensions({
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
          })
        }
      }

      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
        }
      }
    }
  }, [mediaStream])

  return (
    <div className="video-preview-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-preview"
        />
        {isRecording && (
          <div className="recording-overlay">
            <div className="recording-badge">
              <span className="recording-dot"></span>
              <span className="recording-text">REC</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPreview

