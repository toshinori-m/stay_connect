import { ReactNode, HTMLInputTypeAttribute, useId } from "react"

interface InputFieldProps {
  name?: string
  title: ReactNode
  type?: HTMLInputTypeAttribute
  placeholder?: string
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  min?: string
}

export default function InputField({
  name,
  title,
  type,
  placeholder = "",
  value,
  onChange,
  required = false,
  className = "",
  min
}: InputFieldProps) {
  const id = useId()

  return (
    <div className="w-full md:flex md:px-8 items-center">
      <label
        htmlFor={id}
        className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm"
      >
        {title}
      </label>
      <input
        className={`w-full py-3 px-1.5 my-2 border-2 border-gray-200 rounded-lg ${className}`}
        id={id}
        name={name}
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
