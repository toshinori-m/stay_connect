import { JSX } from "react"

interface ErrorDisplayProps {
  errors: string[]
  tag?: "ul" | "p"
  className?: string
  center?: boolean
}

export default function ErrorDisplay({
  errors,
  tag = "ul",
  className = "",
  center = false
}: ErrorDisplayProps) {
  if (!errors.length) return null

  const Tag = tag as keyof JSX.IntrinsicElements

  return (
    <Tag className={`text-red-500 text-sm my-4 ${center ? "text-center" : "text-left"} ${className}`.trim()}>
      {errors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </Tag>
  )
}
