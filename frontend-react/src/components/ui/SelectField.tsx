import React, { ReactNode, useId } from "react"
import { SelectOption } from "@/types"

interface SelectFieldProps {
  name?: string
  title?: ReactNode
  value: string | number | string[]  
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  multiple?: boolean
}

const renderPlaceholderOption = (multiple: boolean, placeholder: string) => {
  if (multiple) return null
  return (
    <option disabled value="">
      {placeholder}
    </option>
  )
}

const renderOptions = (options: SelectOption[]) => {
  return options.map((opt) => (
    <option key={opt.id} value={opt.id}>
      {opt.name}
    </option>
  ))
}

export default function SelectField({
  name,
  title,
  value,
  onChange,
  options,
  placeholder = "1つを選択して下さい",
  className = "",
  multiple = false
}: SelectFieldProps) {
  const id = useId()

  return (
    <div className="w-full md:flex md:px-8 items-center">
      {title && (
        <p className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm">
          {title}
        </p>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        multiple={multiple}
        className={`w-full py-3 px-1.5 my-2 border-2 border-gray-200 rounded-lg ${className}`}
      >
        {renderPlaceholderOption(multiple, placeholder)}
        {renderOptions(options)}
      </select>
    </div>
  )
}
