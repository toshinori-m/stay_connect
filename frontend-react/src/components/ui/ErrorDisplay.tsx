interface ErrorDisplayProps {
  errors: string[]
  className?: string
}

export default function ErrorDisplay({
  errors,
  className = ""
}: ErrorDisplayProps) {
  if (!errors.length) return null

  return (
    <ul className={`text-red-500 text-sm my-4 mx-auto w-fit ${className}`}>
      {errors.map((error, index) => (
        <li key={index} className="text-left">{error}</li>
      ))}
    </ul>
  )
}
