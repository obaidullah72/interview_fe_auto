import ControlsBar from './ControlsBar'

const TranscriptPanel = ({
  questions,
  currentQuestionIndex,
  currentQuestion,
  answers,
  transcribedText,
  transcript,
  isListening,
  isSpeaking,
  isRecording,
  isLoadingState,
  allQuestionsAnswered,
  onPlayQuestion,
  onStartRecording,
  onStopRecording,
  onCompleteInterview,
  onResetInterview,
}) => {
  const hasQuestions = questions.length > 0

  return (
    <div className="interview-transcript-column">
      <div className="interview-card transcript-card">
        <div className="interview-card-header">
          <span className="interview-card-title">AI Transcript</span>
          {hasQuestions && (
            <span className="interview-card-meta">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          )}
        </div>

        <div className="messages-container">
          {!hasQuestions ? (
            <div className="empty-chat">
              <div className="empty-icon">💬</div>
              <div className="empty-text">Waiting for questions...</div>
            </div>
          ) : (
            <>
              {answers.map((answer, idx) => (
                <div key={idx} className="message-thread">
                  <div className="message message-incoming">
                    <div className="message-avatar">AI</div>
                    <div className="message-bubble question-bubble">
                      <div className="message-text">{answer.question_text}</div>
                      <div className="message-time">Question {answer.question_number}</div>
                    </div>
                  </div>
                  <div className="message message-outgoing">
                    <div className="message-bubble answer-bubble">
                      <div className="message-text">{answer.transcribed_answer}</div>
                      <div className="message-time">Your answer</div>
                    </div>
                  </div>
                </div>
              ))}

              {!allQuestionsAnswered && currentQuestion && (
                <div className="message message-incoming">
                  <div className="message-avatar">AI</div>
                  <div className="message-bubble question-bubble">
                    <div className="message-text">{currentQuestion}</div>
                    <div className="message-time">Question {currentQuestionIndex + 1}</div>
                    <button
                      onClick={onPlayQuestion}
                      className="play-question-btn"
                      disabled={isSpeaking || isRecording}
                    >
                      {isSpeaking ? '🔊 Speaking...' : '🔊 Play'}
                    </button>
                  </div>
                </div>
              )}

              {(transcribedText || (isListening && transcript)) && !allQuestionsAnswered && (
                <div className="message message-outgoing">
                  <div className="message-bubble answer-bubble">
                    <div className="message-text">{transcribedText || transcript}</div>
                    {isListening && <div className="recording-badge">Recording...</div>}
                  </div>
                </div>
              )}

              {isLoadingState && (
                <div className="message message-outgoing">
                  <div className="message-bubble answer-bubble">
                    <div className="message-text">Transcribing your answer...</div>
                  </div>
                </div>
              )}

              {allQuestionsAnswered && (
                <div className="message message-incoming">
                  <div className="message-avatar">AI</div>
                  <div className="message-bubble completion-bubble">
                    <div className="completion-content">
                      {/* <div className="completion-icon">✓</div> */}
                      <div className="completion-text-group">
                        <div className="completion-title">Interview complete</div>
                        <div className="completion-subtitle">
                          You&apos;ve answered all {questions.length} questions. Take a moment to review your
                          responses, then submit when you&apos;re ready.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <ControlsBar
          hasQuestions={hasQuestions}
          allQuestionsAnswered={allQuestionsAnswered}
          isRecording={isRecording}
          isSpeaking={isSpeaking}
          isLoadingState={isLoadingState}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          onCompleteInterview={onCompleteInterview}
          onResetInterview={onResetInterview}
        />
      </div>
    </div>
  )
}

export default TranscriptPanel
