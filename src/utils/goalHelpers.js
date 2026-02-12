export function getCumulativeProgress(goal) {
  const total = goal.entries.reduce((sum, e) => sum + e.value, 0)
  const percent = goal.target > 0 ? Math.min((total / goal.target) * 100, 100) : 0
  return { current: total, target: goal.target, percent }
}

export function getAbsoluteProgress(goal) {
  if (goal.entries.length === 0) {
    return { current: goal.startValue ?? 0, target: goal.target, percent: 0 }
  }
  const sorted = [...goal.entries].sort((a, b) => new Date(b.date) - new Date(a.date))
  const current = sorted[0].value
  const start = goal.startValue ?? sorted[sorted.length - 1].value
  const totalDistance = Math.abs(goal.target - start)
  if (totalDistance === 0) return { current, target: goal.target, percent: 100 }
  const traveled = Math.abs(current - start)
  const percent = Math.min((traveled / totalDistance) * 100, 100)
  return { current, target: goal.target, percent }
}

export function getStreakData(goal) {
  const completedDates = new Set(goal.entries.map((e) => e.date))

  // Current streak: count consecutive days ending today (or most recent entry)
  let currentStreak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(today)
  while (completedDates.has(formatDate(d))) {
    currentStreak++
    d.setDate(d.getDate() - 1)
  }

  // Longest streak
  const sortedDates = [...completedDates].sort()
  let longestStreak = 0
  let streak = 0
  let prev = null
  for (const dateStr of sortedDates) {
    const date = new Date(dateStr + 'T00:00:00')
    if (prev) {
      const diff = (date - prev) / (1000 * 60 * 60 * 24)
      streak = diff === 1 ? streak + 1 : 1
    } else {
      streak = 1
    }
    longestStreak = Math.max(longestStreak, streak)
    prev = date
  }

  return { currentStreak, longestStreak, completedDates }
}

export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getProgressColor(percent) {
  if (percent >= 75) return '#22c55e' // green
  if (percent >= 50) return '#eab308' // yellow
  if (percent >= 25) return '#f97316' // orange
  return '#ef4444' // red
}

export function getMilestones(percent) {
  return [25, 50, 75, 100].map((m) => ({ value: m, reached: percent >= m }))
}
