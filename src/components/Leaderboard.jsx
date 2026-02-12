import { getCumulativeProgress, getAbsoluteProgress, getStreakData } from '../utils/goalHelpers'
import ProgressBar from './ProgressBar'

function getProgress(goal) {
  if (goal.type === 'cumulative') return getCumulativeProgress(goal)
  if (goal.type === 'absolute') return getAbsoluteProgress(goal)
  if (goal.type === 'streak') {
    const { currentStreak } = getStreakData(goal)
    return { current: currentStreak, target: null, percent: currentStreak }
  }
  return { current: 0, target: 0, percent: 0 }
}

function getSortValue(goal) {
  if (goal.type === 'streak') {
    return getStreakData(goal).currentStreak
  }
  return getProgress(goal).percent
}

export default function Leaderboard({ goals, goalName }) {
  const sorted = [...goals].sort((a, b) => getSortValue(b) - getSortValue(a))
  const isStreak = sorted[0]?.type === 'streak'

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">{goalName}</h3>
        <span className="text-xs text-gray-500">{goals.length} participant{goals.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="space-y-2">
        {sorted.map((goal, idx) => {
          const progress = getProgress(goal)
          return (
            <div key={`${goal.username}-${goal.id}`} className="flex items-center gap-3">
              <span className="text-sm font-mono text-gray-400 w-6 text-right">{idx + 1}.</span>
              <span className="text-sm font-medium text-gray-700 w-24 truncate">@{goal.username}</span>
              <div className="flex-1">
                {isStreak ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">{progress.current}</span>
                    <span className="text-xs text-gray-500">day streak</span>
                  </div>
                ) : (
                  <ProgressBar
                    percent={progress.percent}
                    label={`${progress.current} / ${progress.target} ${goal.unit}`}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
