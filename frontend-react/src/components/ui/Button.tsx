import React from "react"
import clsx from "clsx"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "signup" | "ok" | "login"
}

export default function Button({ variant = "ok", className, children, ...props }: ButtonProps) {
  const baseClass = {
    signup: "btn-signup",
    ok: "btn-ok",
    login: "btn-login",
  }[variant]

  return (
    <button className={clsx(baseClass, className)} {...props}>
      {children}
    </button>
  )
}
