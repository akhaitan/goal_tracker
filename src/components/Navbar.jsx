import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function Navbar() {
  const { username, logout, isLoggedIn } = useUser()

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold tracking-tight">Goal Tracker</Link>
        {isLoggedIn && (
          <Link to="/dashboard" className="text-sm hover:text-gray-300">Dashboard</Link>
        )}
        <Link to="/global" className="text-sm hover:text-gray-300">Global</Link>
      </div>
      {isLoggedIn && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">@{username}</span>
          <button
            onClick={logout}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
