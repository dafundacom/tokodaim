import * as React from "react"

import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface InputAccountIdProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  category: string
  brand: string
  setQueryAccountId: React.Dispatch<React.SetStateAction<string>>
}

const InputAccountId: React.FC<InputAccountIdProps> = (props) => {
  const { label, category, brand, setQueryAccountId, ...rest } = props

  const placeholder = `Enter ${label}`

  const type =
    category === "E-Money" || category === "Pulsa" ? "number" : "text"

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const savedQuery = localStorage.getItem(`queryAccountId-${brand}`)
    if (savedQuery && inputRef.current) {
      inputRef.current.value = savedQuery
      setQueryAccountId(savedQuery)
    }
  }, [brand, setQueryAccountId])

  const handleInputOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQueryAccountId(value)
    localStorage.setItem(`queryAccountId-${brand}`, value)
  }

  return (
    <div>
      <FormLabel htmlFor="server">{label}</FormLabel>
      <Input
        id="server"
        ref={inputRef}
        type={type}
        onBlur={handleInputOnBlur}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  )
}

export default InputAccountId
