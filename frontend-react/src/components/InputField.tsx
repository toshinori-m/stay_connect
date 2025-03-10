import { ReactNode } from "react"

interface InputFieldProps {
  label: ReactNode
  type: "text" | "email" | "password"
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputField = ({ label, type, placeholder, value, onChange }: InputFieldProps) => {
  return (
    <div className="w-full md:flex md:px-8 items-center">
      <p className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm">{label}</p>
      <input
        className="w-full py-3 px-1.5 my-2 border-2 border-gray-200"
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default InputField
