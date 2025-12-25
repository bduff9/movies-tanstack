import type { FC } from 'react'
import { useId } from 'react'

type Props = {
  title: string
}

const MovieItemPlaceholder: FC<Props> = ({ title }) => {
  const displayTitle = title.length > 10 ? title.substring(0, 10) : title
  const gradientId = useId()

  return (
    <svg
      width="114"
      height="152"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto rounded-lg"
      role="img"
      aria-label={`Placeholder for ${title}`}
    >
      <title>{`Placeholder for ${title}`}</title>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="114"
        height="152"
        rx="8"
        fill={`url(#${gradientId})`}
      />
      <text
        x="50%"
        y="50%"
        fontSize="14"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fill="#64748b"
        fontWeight="500"
      >
        {displayTitle}
      </text>
    </svg>
  )
}

export default MovieItemPlaceholder
