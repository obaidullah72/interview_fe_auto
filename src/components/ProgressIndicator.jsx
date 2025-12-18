import './ProgressIndicator.css'

const ProgressIndicator = ({ current, total }) => {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0

  return (
    <div className="progress-indicator">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-text">
        Question {current + 1} of {total}
      </div>
    </div>
  )
}

export default ProgressIndicator

