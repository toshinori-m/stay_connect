import { ReactNode } from "react"
import Button from "@/components/ui/Button"

interface ButtonFieldProps {
  label: string
  children: ReactNode
  variant?: "primary" | "ghost" | "yellow" | "red"
  size?: "lg" | "sm"
  type?: "button" | "submit"
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function ButtonField({
  label,
  children,
  variant = "primary",
  size = "sm",
  type = "button",
  onClick,
  className,
  disabled,
}: ButtonFieldProps) {
  return (
    <div className="w-full flex md:px-8 items-center">
      <p className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm">{label}</p>
      <div className="w-full my-2">
        <Button
          variant={variant}
          size={size}
          type={type}
          onClick={onClick}
          className={className}
          disabled={disabled}
        >
          {children}
        </Button>
      </div>
    </div>
  )
}

