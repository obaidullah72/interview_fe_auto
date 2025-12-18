import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import AppRoutes from './Routes'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <div className="app-container">
        <AppRoutes />
      </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
