import { getMilestones, getProgressColor } from '../utils/goalHelpers'

export default function RingGauge({ percent }) {
  const milestones = getMilestones(percent)

  return (
    <div className="flex gap-2 items-center">
      {milestones.map((m) => (
        <div key={m.value} className="flex flex-col items-center">
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            {m.reached && (
              <circle
                cx="18" cy="18" r="14"
                fill="none"
                stroke={getProgressColor(m.value)}
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 14}`}
                strokeDashoffset="0"
                transform="rotate(-90 18 18)"
              />
            )}
            <text
              x="18" y="18"
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[8px] font-bold"
              fill={m.reached ? getProgressColor(m.value) : '#9ca3af'}
            >
              {m.value}%
            </text>
          </svg>
        </div>
      ))}
    </div>
  )
}
