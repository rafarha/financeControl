"use client"

import { Category } from "@/prisma/client"
import { SelectProps } from "@radix-ui/react-select"
import { useMemo } from "react"
import { FormCombobox } from "@/components/ui/combobox"
import { FormSelect } from "./simple"

export const FormSelectCategory = ({
  title,
  categories,
  emptyValue,
  placeholder,
  hideIfEmpty = false,
  isRequired = false,
  ...props
}: {
  title: string
  categories: Category[]
  emptyValue?: string
  placeholder?: string
  hideIfEmpty?: boolean
  isRequired?: boolean
} & SelectProps) => {
  const items = useMemo(
    () => categories.map((category) => ({ code: category.code, name: category.name, color: category.color })),
    [categories]
  )
  return (
    <FormSelect
      title={title}
      items={items}
      emptyValue={emptyValue}
      placeholder={placeholder}
      hideIfEmpty={hideIfEmpty}
      isRequired={isRequired}
      {...props}
    />
  )
}

export const FormComboboxCategory = ({
  title,
  categories,
  placeholder,
  hideIfEmpty = false,
  isRequired = false,
  ...props
}: {
  title: string
  categories: Category[]
  placeholder?: string
  hideIfEmpty?: boolean
  isRequired?: boolean
} & SelectProps) => {
  const items = useMemo(
    () => categories.map((category) => ({ code: category.code, name: category.name, color: category.color })),
    [categories]
  )

  if (hideIfEmpty && categories.length === 0) {
    return null
  }

  return (
    <FormCombobox
      title={title}
      items={items}
      placeholder={placeholder}
      {...props}
    />
  )
}
