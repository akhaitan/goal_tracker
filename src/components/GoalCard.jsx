import { useState } from 'react'
import ProgressBar from './ProgressBar'
import RingGauge from './RingGauge'
import StreakCalendar from './StreakCalendar'
import LogEntryForm from './LogEntryForm'
import GoalForm from './GoalForm'
import { getCumulativeProgress, getAbsoluteProgress, getStreakData } from '../utils/goalHelpers'

export default function GoalCard({ goal, onUpdate, onDelete }) {
  const [showLog, setShowLog] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  function handleLogEntry(entry) {
    const updated = { ...goal, entries: [...goal.entries, entry] }
    onUpdate(updated)
    setShowLog(false)
  }

  function handleEditSave(updatedGoal) {
    onUpdate(updatedGoal)
    setShowEdit(false)
  }

  function renderProgress() {
    if (goal.type === 'cumulative') {
      const { current, target, percent } = getCumulativeProgress(goal)
      return (
        <div className="space-y-3">
          <ProgressBar percent={percent} label={`${current} / ${target} ${goal.unit}`} />
          <RingGauge percent={percent} />
        </div>
      )
    }
    if (goal.type === 'absolute') {
      const { current, target, percent } = getAbsoluteProgress(goal)
      return (
        <div className="space-y-3">
          <ProgressBar percent={percent} label={`${current} / ${target} ${goal.unit}`} />
          <RingGauge percent={percent} />
        </div>
      )
    }
    if (goal.type === 'streak') {
      return <StreakCalendar goal={goal} />
    }
  }

  const typeLabel = { cumulative: 'Cumulative', absolute: 'Absolute', streak: 'Streak' }
  const typeBadgeColor = {
    cumulative: 'bg-blue-100 text-blue-700',
    absolute: 'bg-purple-100 text-purple-700',
    streak: 'bg-green-100 text-green-700',
  }

  if (showEdit) {
    return (
      <GoalForm
        existingGoal={goal}
        onSave={handleEditSave}
        onCancel={() => setShowEdit(false)}
      />
    )
  }

  const sortedEntries = [...goal.entries].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="bg-white border rounded-lg p-5 space-y-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{goal.name}</h3>
          <div className="flex gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadgeColor[goal.type]}`}>
              {typeLabel[goal.type]}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              goal.visibility === 'public' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {goal.visibility === 'public' ? 'Public' : 'Private'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {renderProgress()}

      {!showLog && (
        <button
          onClick={() => setShowLog(true)}
          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-sm hover:bg-blue-100"
        >
          Log Progress
        </button>
      )}

      {showLog && (
        <LogEntryForm goal={goal} onSave={handleLogEntry} onCancel={() => setShowLog(false)} />
      )}

      {sortedEntries.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {showHistory ? 'Hide' : 'Show'} History ({sortedEntries.length} entries)
          </button>
          {showHistory && (
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {sortedEntries.map((entry) => (
                <div key={entry.id} className="text-xs text-gray-600 flex justify-between bg-gray-50 px-2 py-1 rounded">
                  <span>{entry.date}</span>
                  <span>
                    {goal.type === 'streak' ? 'Completed' : `${goal.type === 'cumulative' ? '+' : ''}${entry.value} ${goal.unit}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
