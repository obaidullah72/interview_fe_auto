const SessionSidebar = ({
  user,
  sessions,
  selectedSession,
  isLoadingSessions,
  onLogout,
  onSelectSession,
  onDeleteSession,
  formatDate,
}) => {
  const isAdmin = user?.profile?.role === 'Admin'

  const handleDeleteClick = (e, session) => {
    e.stopPropagation()
    if (!isAdmin) return
    if (onDeleteSession) {
      onDeleteSession(session)
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-user">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
          <div className="user-details">
            <div className="user-name">{user?.username || 'User'}</div>
            <div className="user-status">{isAdmin ? 'Admin' : 'Online'}</div>
          </div>
        </div>
        <button onClick={onLogout} className="sidebar-logout" title="Logout">
          ⎋
        </button>
      </div>

      <div className="sidebar-search">
        <input type="text" placeholder="Search sessions..." className="search-input" />
      </div>

      <div className="sidebar-sessions">
        <div className="sidebar-section-title">Interview Sessions</div>
        {isLoadingSessions ? (
          <div className="sidebar-loading">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="sidebar-empty">No sessions yet</div>
        ) : (
          <div className="sessions-list">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`session-item ${selectedSession?.id === session.id ? 'active' : ''}`}
                onClick={() => onSelectSession(session)}
              >
                <div className="session-avatar">{session.is_completed ? '✓' : '●'}</div>
                <div className="session-info">
                  <div className="session-name">
                    Session {session.id}
                    {isAdmin && session.user?.username ? ` • ${session.user.username}` : ''}
                  </div>
                  <div className="session-preview">
                    {session.answers && session.answers.length > 0
                      ? session.answers[0].transcribed_answer?.substring(0, 40) + '...'
                      : 'No answers yet'}
                  </div>
                </div>
                <div className="session-time">
                  <span>{formatDate(session.started_at)}</span>
                  {isAdmin && (
                    <button
                      className="session-delete-button"
                      title="Delete session"
                      onClick={(e) => handleDeleteClick(e, session)}
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionSidebar
