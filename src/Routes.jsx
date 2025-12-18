import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import InterviewPage from './pages/InterviewPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div className="loading-container">Loading...</div>
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <InterviewPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

