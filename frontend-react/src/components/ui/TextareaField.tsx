import { ReactNode } from "react"

interface TextareaFieldProps {
  name?: string
  label: ReactNode
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
  className?: string
  rows?: number
}

export default function TextareaField({
  name,
  label,
  placeholder = "",
  value,
  onChange,
  required = false,
  className = "",
  rows = 4,
}: TextareaFieldProps) {
  return (
    <div className="w-full md:flex md:px-8 items-center">
      <p className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm">{label}</p>
      <textarea
        className={`w-full py-3 px-1.5 my-2 border-2 border-gray-200 resize-none rounded-lg ${className}`}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
      />
    </div>
  )
}
