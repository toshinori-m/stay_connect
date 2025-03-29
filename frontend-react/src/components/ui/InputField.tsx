import { ReactNode } from "react"

interface InputFieldProps {
  label: ReactNode
  type?: "text" | "email" | "password" | "url" | "radio" | "date" | "number" | "text"
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  min?: string
}

export default function InputField({ 
  label,
  type,
  placeholder = "",
  value,
  onChange,
  required = false,
  className = "",
  min
}: InputFieldProps) {
  return (
    <div className="w-full md:flex md:px-8 items-center">
      <p className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm">{label}</p>
      <input
        className={`w-full py-3 px-1.5 my-2 border-2 border-gray-200 rounded-lg ${className}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
      />
    </div>
  )
}
