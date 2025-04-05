import React from "react"
import clsx from "clsx"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost"
  size?: "lg" | "sm"
}

export default function Button({ variant = "primary", size = "sm", className, children, ...props }: ButtonProps) {
  const variantClass = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    yellow: "btn-yellow",
    red: "btn-red",
  }[variant]

  const sizeClass = {
    lg: "btn-lg",
    sm: "btn-sm",
  }[size]

  return (
    <button className={clsx("btn", variantClass, sizeClass, className)} {...props}>
      {children}
    </button>
  )
}
