import { getProgressColor } from '../utils/goalHelpers'

export default function ProgressBar({ percent, label }) {
  const color = getProgressColor(percent)

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
