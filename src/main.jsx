import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/r/:slug/*" element={<App />} />
        <Route path = "login" element={<LoginPage />} />
        <Route path = "dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />  
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)