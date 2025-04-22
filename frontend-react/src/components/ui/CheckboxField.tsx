import { ChangeEvent, useId } from "react"

interface CheckboxFieldProps {
  name: string
  title: string
  statusText?: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export default function CheckboxField({
  name,
  title,
  statusText,
  checked,
  onChange,
  className = ""
}: CheckboxFieldProps) {
  const id = useId()

  return (
    <div className={`flex md:px-8 items-center ${className}`}>
      <label
        htmlFor={id}
        className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm"
      >
        {title}
      </label>
      <div className="flex items-center">
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="border-gray-200"
        />
        <span className="ml-2 mt-1 text-sm text-gray-700">
          {statusText}
        </span>
      </div>
    </div>
  )
}
