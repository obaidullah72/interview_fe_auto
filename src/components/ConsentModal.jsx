import './ConsentModal.css'

const ConsentModal = ({ onGrant, isLoading }) => {
  return (
    <div className="consent-modal">
      <div className="consent-card">
        <div className="consent-badge">Interview Setup</div>
        <div className="consent-layout">
          <div className="consent-visual">
            <div className="consent-icon">🎥</div>
            <div className="consent-video-placeholder" />
          </div>
          <div className="consent-content">
            <h2>Enable camera & microphone</h2>
            <p>
              We use your camera and microphone only during the mock interview session.
              This lets you experience a realistic, face-to-face interview environment.
            </p>
            <ul className="consent-list">
              <li>• Required once per device and browser.</li>
              <li>• Used only while you are in an interview.</li>
              <li>• You can revoke access any time in browser settings.</li>
            </ul>
            <button
              onClick={onGrant}
              className="btn btn-primary btn-large"
              disabled={isLoading}
            >
              {isLoading ? 'Requesting permissions…' : 'Grant camera & mic access'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsentModal
