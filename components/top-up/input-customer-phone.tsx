"use client"

import * as React from "react"
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export interface InputCustomerPhoneProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  name: Path<TFieldValues>
}

const InputCustomerPhone = <TFieldValues extends FieldValues = FieldValues>(
  props: InputCustomerPhoneProps<TFieldValues>,
) => {
  const { form, name } = props

  React.useEffect(() => {
    const savedQuery = localStorage.getItem(`input-customer-phone`)
    if (savedQuery) {
      form.setValue(
        name,
        savedQuery as PathValue<TFieldValues, Path<TFieldValues>>,
      )
    }
  }, [form, name])

  const handleInputOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    localStorage.setItem(`input-customer-phone`, value)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      rules={{
        required: "Nomor HP harus diisi",
        pattern: {
          value: /^0\d{8,19}$/,
          message: "Nomor HP tidak valid",
        },
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nomor HP</FormLabel>
          <FormControl>
            <Input
              type="tel"
              placeholder="08123xxxxxxxx"
              {...field}
              onBlur={(event) => {
                field.onBlur()
                handleInputOnBlur(event)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default InputCustomerPhone
