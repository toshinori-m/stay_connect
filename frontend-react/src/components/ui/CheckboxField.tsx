import { ChangeEvent } from "react"

interface CheckboxFieldProps {
  name: string
  label: string
  statusText?: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export default function CheckboxField({
  name,
  label,
  statusText,
  checked,
  onChange,
  className = ""
}: CheckboxFieldProps) {
  return (
    <div className={`flex md:px-8 items-center ${className}`}>
      <p className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm">{label}</p>
      <div className="flex items-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="border-gray-200"
        />
        {statusText && (
          <label htmlFor={name} className="ml-2 mt-1">
            {statusText}
          </label>
        )}
      </div>
    </div>
  )
}
