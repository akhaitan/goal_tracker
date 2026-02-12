import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getGoals, saveGoal, deleteGoal } from '../utils/storage'
import GoalCard from '../components/GoalCard'
import GoalForm from '../components/GoalForm'

export default function DashboardPage() {
  const { username, isLoggedIn } = useUser()
  const navigate = useNavigate()
  const [goals, setGoals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const refreshGoals = useCallback(async () => {
    if (!username) return
    const data = await getGoals(username)
    setGoals(data)
    setLoading(false)
  }, [username])

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/', { replace: true })
      return
    }
    refreshGoals()
  }, [isLoggedIn, navigate, refreshGoals])

  async function handleCreateGoal(goal) {
    await saveGoal(username, goal)
    await refreshGoals()
    setShowForm(false)
  }

  async function handleUpdateGoal(goal) {
    await saveGoal(username, goal)
    await refreshGoals()
  }

  async function handleDeleteGoal(goalId) {
    if (confirm('Delete this goal? This cannot be undone.')) {
      await deleteGoal(username, goalId)
      await refreshGoals()
    }
  }

  const filtered = filter === 'all' ? goals : goals.filter((g) => g.type === filter)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">My Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add New Goal'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <GoalForm onSave={handleCreateGoal} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {['all', 'cumulative', 'absolute', 'streak'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded-full ${
              filter === f
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No goals yet</p>
          <p className="text-sm mt-1">Create your first goal to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}
    </div>
  )
}
