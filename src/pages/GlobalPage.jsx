import { useState, useEffect } from 'react'
import { getAllPublicGoals } from '../utils/storage'
import Leaderboard from '../components/Leaderboard'

export default function GlobalPage() {
  const [groups, setGroups] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const publicGoals = await getAllPublicGoals()
      const grouped = {}
      for (const goal of publicGoals) {
        const key = goal.name.toLowerCase().trim()
        if (!grouped[key]) {
          grouped[key] = { displayName: goal.name, goals: [] }
        }
        grouped[key].goals.push(goal)
      }
      setGroups(grouped)
      setLoading(false)
    }
    load()
  }, [])

  const groupEntries = Object.entries(groups).sort((a, b) =>
    b[1].goals.length - a[1].goals.length
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Global Tracking</h1>
      <p className="text-sm text-gray-500 mb-6">See how everyone is progressing on their public goals.</p>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : groupEntries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No public goals yet</p>
          <p className="text-sm mt-1">Be the first to create a public goal!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupEntries.map(([key, group]) => (
            <Leaderboard key={key} goals={group.goals} goalName={group.displayName} />
          ))}
        </div>
      )}
    </div>
  )
}
