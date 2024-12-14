"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"

export interface EditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Editor({
  value,
  onChange,
  placeholder,
  className,
  ...props
}: EditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "min-h-[200px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}