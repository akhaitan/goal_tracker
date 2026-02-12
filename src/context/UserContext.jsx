import { createContext, useContext, useState, useCallback } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [username, setUsername] = useState(() => localStorage.getItem('goaltracker_currentUser') || '')

  const login = useCallback((name) => {
    const trimmed = name.trim().toLowerCase()
    localStorage.setItem('goaltracker_currentUser', trimmed)
    setUsername(trimmed)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('goaltracker_currentUser')
    setUsername('')
  }, [])

  return (
    <UserContext.Provider value={{ username, login, logout, isLoggedIn: !!username }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
