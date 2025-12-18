import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-hero">
          <div className="auth-logo-circle">QA</div>
          <h1>Structured interview practice, powered by AI.</h1>
          <p>
            Log in to continue your mock interviews, review past sessions, and
            track how your answers improve over time.
          </p>
          <ul className="auth-hero-list">
            <li>Realistic, question-by-question interview flow.</li>
            <li>Automatic transcription of your spoken answers.</li>
            <li>Session history so you can reflect and iterate.</li>
          </ul>
        </div>

        <div className="auth-container">
          <h2>Welcome back</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
