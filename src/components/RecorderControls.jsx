import './RecorderControls.css'

const RecorderControls = ({
  isRecording,
  isLoading,
  onStartRecording,
  onStopRecording,
  disabled,
}) => {
  return (
    <div className="recorder-controls">
      {!isRecording ? (
        <button
          onClick={onStartRecording}
          className="btn btn-record"
          disabled={disabled || isLoading}
        >
          🎤 Start Recording
        </button>
      ) : (
        <button
          onClick={onStopRecording}
          className="btn btn-stop"
        >
          ⏹️ Stop Recording
        </button>
      )}
    </div>
  )
}

export default RecorderControls

