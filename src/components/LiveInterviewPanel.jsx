import VideoPreview from './VideoPreview'

const LiveInterviewPanel = ({ mediaStream, isRecording }) => {
  return (
    <div className="interview-video-column">
      <div className="interview-card">
        <div className="interview-card-header">
          <span className="interview-card-title">Live Interview</span>
          {isRecording && (
            <div className="header-recording-indicator">
              <span className="recording-dot-small"></span>
              <span>Recording</span>
            </div>
          )}
        </div>
        <div className="main-video-wrapper">
          <VideoPreview mediaStream={mediaStream} isRecording={isRecording} />
        </div>
      </div>
    </div>
  )
}

export default LiveInterviewPanel
