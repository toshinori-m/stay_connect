import { useId } from "react"

interface TextareaFieldProps {
  name?: string
  title: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
  className?: string
  rows?: number
}

export default function TextareaField({
  name,
  title,
  placeholder = "",
  value,
  onChange,
  required = false,
  className = "",
  rows = 4,
}: TextareaFieldProps) {
  const id = useId()

  return (
    <div className="w-full md:flex md:px-8 items-center">
      <label
        htmlFor={id}
        className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm"
      >
        {title}
      </label>
      <textarea
        className={`w-full py-3 px-1.5 my-2 border-2 border-gray-200 resize-none rounded-lg ${className}`}
        id={id}
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
