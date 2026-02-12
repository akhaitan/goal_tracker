import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function LoginPage() {
  const [input, setInput] = useState('')
  const { login, isLoggedIn, username } = useUser()
  const navigate = useNavigate()

  if (isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, @{username}</h1>
          <p className="text-sm text-gray-500 mb-6">Where would you like to go?</p>
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              My Dashboard
            </Link>
            <Link
              to="/global"
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Global Tracking
            </Link>
          </div>
        </div>
      </div>
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (input.trim()) {
      login(input)
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Goal Tracker</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Track your goals, build streaks, compete with others.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
              autoFocus
              placeholder="Enter your username"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4 text-center">No password required. Data is stored in your browser.</p>
      </div>
    </div>
  )
}
