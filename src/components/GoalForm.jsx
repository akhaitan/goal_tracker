import { useState, useEffect } from 'react'
import { generateId } from '../utils/uuid'
import { getAllGoalNames } from '../utils/storage'

const NEW_GOAL_VALUE = '__new__'

const PRESET_GOALS = [
  // Cumulative
  'Pushups', 'Words written', 'Pull-ups',
  // Absolute
  'Goal weight', 'Mile time', 'Half marathon time', 'Body fat %', 'Plank hold', 'Savings',
  // Streak
  'Read daily', 'No alcohol', 'Sleep 8 hours', 'Study a language',
]

export default function GoalForm({ onSave, onCancel, existingGoal }) {
  const [existingNames, setExistingNames] = useState(PRESET_GOALS.sort((a, b) => a.localeCompare(b)))

  useEffect(() => {
    async function loadNames() {
      const userNames = await getAllGoalNames()
      const all = new Set([...PRESET_GOALS, ...userNames])
      setExistingNames([...all].sort((a, b) => a.localeCompare(b)))
    }
    loadNames()
  }, [])

  const [selectedName, setSelectedName] = useState(
    existingGoal ? existingGoal.name : ''
  )
  const [customName, setCustomName] = useState('')
  const isCustom = selectedName === NEW_GOAL_VALUE
  const name = isCustom ? customName : selectedName

  const [type, setType] = useState(existingGoal?.type || 'cumulative')
  const [target, setTarget] = useState(existingGoal?.target || '')
  const [unit, setUnit] = useState(existingGoal?.unit || '')
  const [startValue, setStartValue] = useState(existingGoal?.startValue || '')
  const [visibility, setVisibility] = useState(existingGoal?.visibility || 'public')

  function handleSubmit(e) {
    e.preventDefault()
    const goal = {
      id: existingGoal?.id || generateId(),
      name: name.trim(),
      type,
      target: type === 'streak' ? null : Number(target),
      unit: unit.trim() || (type === 'streak' ? 'days' : ''),
      startValue: type === 'absolute' ? Number(startValue) : null,
      visibility,
      createdAt: existingGoal?.createdAt || new Date().toISOString(),
      entries: existingGoal?.entries || [],
    }
    onSave(goal)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold">{existingGoal ? 'Edit Goal' : 'New Goal'}</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
        {existingGoal ? (
          <input
            type="text"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />
        ) : (
          <>
            <select
              value={selectedName}
              onChange={(e) => {
                setSelectedName(e.target.value)
                if (e.target.value !== NEW_GOAL_VALUE) setCustomName('')
              }}
              className="w-full border rounded px-3 py-2 text-sm"
              required={!isCustom}
            >
              <option value="" disabled>Select a goal...</option>
              {existingNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value={NEW_GOAL_VALUE}>+ Create new goal</option>
            </select>
            {isCustom && (
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                autoFocus
                className="w-full border rounded px-3 py-2 text-sm mt-2"
                placeholder="e.g., Do 1000 pushups"
              />
            )}
          </>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          disabled={!!existingGoal}
        >
          <option value="cumulative">Cumulative (sum entries toward target)</option>
          <option value="absolute">Absolute (track a number toward target)</option>
          <option value="streak">Daily Streak</option>
        </select>
      </div>

      {type !== 'streak' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="e.g., 1000"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder={type === 'streak' ? 'days' : 'e.g., pushups, lbs'}
        />
      </div>

      {type === 'absolute' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Starting Value</label>
          <input
            type="number"
            value={startValue}
            onChange={(e) => setStartValue(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="e.g., 185"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Visibility:</label>
        <button
          type="button"
          onClick={() => setVisibility(visibility === 'public' ? 'private' : 'public')}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            visibility === 'public' ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              visibility === 'public' ? 'translate-x-6' : ''
            }`}
          />
        </button>
        <span className="text-sm text-gray-600">
          {visibility === 'public' ? 'Public' : 'Private'}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!name.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {existingGoal ? 'Save Changes' : 'Create Goal'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
