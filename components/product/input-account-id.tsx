// TODO: not yet translated

import * as React from "react"

import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface InputAccountIdProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  category: string
  productSlug: string
  setQueryAccountId: React.Dispatch<React.SetStateAction<string>>
}

const InputAccountId: React.FC<InputAccountIdProps> = (props) => {
  const { label, category, productSlug, setQueryAccountId, ...rest } = props

  const placeholder = `Enter ${label}`

  const type =
    category === "E-Money" || category === "Pulsa" ? "number" : "text"

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const savedQuery = localStorage.getItem(`input-account-id-${productSlug}`)
    if (savedQuery && inputRef.current) {
      inputRef.current.value = savedQuery
      setQueryAccountId(savedQuery)
    }
  }, [productSlug, setQueryAccountId])

  const handleInputOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQueryAccountId(value)
    localStorage.setItem(`input-account-id-${productSlug}`, value)
  }

  return (
    <div className="w-full">
      <FormLabel htmlFor="server">{label}</FormLabel>
      <Input
        id="server"
        ref={inputRef}
        type={type}
        onBlur={handleInputOnBlur}
        className="dark:bg-[#4b6584]"
        placeholder={placeholder}
        {...rest}
      />
    </div>
  )
}

export default InputAccountId
