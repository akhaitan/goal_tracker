import { formatDate, getStreakData } from '../utils/goalHelpers'

export default function StreakCalendar({ goal }) {
  const { currentStreak, longestStreak, completedDates } = getStreakData(goal)

  // Build 12 weeks of dates ending today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weeks = []
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 83) // 12 weeks = 84 days
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const d = new Date(startDate)
  while (d <= today) {
    const weekIdx = Math.floor((d - startDate) / (7 * 24 * 60 * 60 * 1000))
    if (!weeks[weekIdx]) weeks[weekIdx] = []
    weeks[weekIdx].push({
      date: formatDate(d),
      completed: completedDates.has(formatDate(d)),
      isFuture: d > today,
    })
    d.setDate(d.getDate() + 1)
  }

  return (
    <div>
      <div className="flex gap-4 mb-3">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{currentStreak}</div>
          <div className="text-xs text-gray-500">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-600">{longestStreak}</div>
          <div className="text-xs text-gray-500">Longest Streak</div>
        </div>
      </div>
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                title={day.date}
                className={`w-3.5 h-3.5 rounded-sm ${
                  day.isFuture
                    ? 'bg-gray-100'
                    : day.completed
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
