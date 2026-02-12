import { useState } from 'react'
import { generateId } from '../utils/uuid'
import { formatDate } from '../utils/goalHelpers'

export default function LogEntryForm({ goal, onSave, onCancel }) {
  const today = formatDate(new Date())
  const [value, setValue] = useState('')
  const [date, setDate] = useState(today)

  const isStreak = goal.type === 'streak'

  function handleSubmit(e) {
    e.preventDefault()
    const entry = {
      id: generateId(),
      value: isStreak ? 1 : Number(value),
      date,
      createdAt: new Date().toISOString(),
    }
    onSave(entry)
  }

  // For streaks, check if today is already logged
  const alreadyLoggedToday = isStreak && goal.entries.some((e) => e.date === date)

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border rounded p-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Log Progress</h4>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
          className="border rounded px-3 py-1.5 text-sm"
        />
      </div>

      {!isStreak && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {goal.type === 'cumulative' ? `Amount (${goal.unit})` : `Current value (${goal.unit})`}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="border rounded px-3 py-1.5 text-sm w-32"
            placeholder={goal.type === 'cumulative' ? '+50' : '172'}
          />
        </div>
      )}

      {isStreak && alreadyLoggedToday && (
        <p className="text-xs text-amber-600">Already logged for {date}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isStreak && alreadyLoggedToday}
          className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStreak ? 'Check In' : 'Log'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
