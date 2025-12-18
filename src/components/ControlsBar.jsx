const ControlsBar = ({
  hasQuestions,
  allQuestionsAnswered,
  isRecording,
  isSpeaking,
  isLoadingState,
  onStartRecording,
  onStopRecording,
  onCompleteInterview,
  onResetInterview,
}) => {
  if (!hasQuestions) return null

  if (!allQuestionsAnswered) {
    return (
      <div className="chat-input-area">
        <div className="input-container">
          {isRecording ? (
            <button
              onClick={onStopRecording}
              className="record-button recording"
              disabled={isLoadingState}
            >
              Stop Recording
            </button>
          ) : (
            <button
              onClick={onStartRecording}
              className="record-button"
              disabled={isSpeaking || isLoadingState}
            >
              🎤 Start Recording
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="chat-input-area">
      <div className="completion-actions">
        <button onClick={onCompleteInterview} className="submit-button">
          Submit Interview
        </button>
        <button onClick={onResetInterview} className="reset-button">
          Start New
        </button>
      </div>
    </div>
  )
}

export default ControlsBar
