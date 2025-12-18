const ConfirmModal = ({ isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="overlay-modal">
      <div className="overlay-backdrop" onClick={onCancel} />
      <div className="overlay-content">
        <div className="overlay-header">
          <div className="overlay-icon">🗑</div>
          <div className="overlay-title">{title}</div>
        </div>
        <div className="overlay-body">{message}</div>
        <div className="overlay-actions">
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
