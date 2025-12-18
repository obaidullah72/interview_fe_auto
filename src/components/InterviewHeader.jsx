const InterviewHeader = ({
  questionsCount,
  currentQuestionIndex,
  voiceProfiles,
  selectedVoiceId,
  onSelectVoice,
}) => {
  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <div className="chat-title">Interview Details</div>
        <div className="chat-subtitle">
          {questionsCount > 0
            ? `Question ${currentQuestionIndex + 1} of ${questionsCount}`
            : 'AI-powered mock interview environment'}
        </div>
        {questionsCount > 0 && voiceProfiles.length > 0 && (
          <div className="voice-selector">
            <span className="voice-label">Voice:</span>
            {voiceProfiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                className={`voice-option ${selectedVoiceId === profile.id ? 'active' : ''}`}
                onClick={() => onSelectVoice(profile.id)}
              >
                {profile.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewHeader
