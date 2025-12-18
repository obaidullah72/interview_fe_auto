import './QuestionPlayer.css'

const QuestionPlayer = ({ question, onPlay, isSpeaking, disabled }) => {
  return (
    <div className="question-player">
      <div className="question-header">
        <span className="question-badge">Question</span>
      </div>
      <div className="question-content">
        <h2 className="question-text">{question}</h2>
      </div>
      <button
        onClick={onPlay}
        className="btn btn-secondary"
        disabled={disabled || isSpeaking}
      >
        {isSpeaking ? '🔊 Speaking...' : '🔊 Play Question'}
      </button>
    </div>
  )
}

export default QuestionPlayer

