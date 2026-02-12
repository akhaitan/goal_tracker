import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import GlobalPage from './pages/GlobalPage'

export default function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/global" element={<GlobalPage />} />
        </Routes>
      </div>
    </UserProvider>
  )
}
