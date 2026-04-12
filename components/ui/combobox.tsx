"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface CategoryItem {
  code: string
  name: string
  color?: string
}

interface ComboboxProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  items: CategoryItem[]
  placeholder?: string
  emptyMessage?: string
  className?: string
}

export function Combobox({
  value,
  defaultValue,
  onValueChange,
  items,
  placeholder = "Select...",
  emptyMessage = "No item found.",
  className,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    value ?? defaultValue
  )
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const selectedItem = items.find((item) => item.code === currentValue)

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setSearch("")
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedItem ? (
            <div className="flex items-center gap-2 truncate">
              {selectedItem.color && (
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: selectedItem.color }}
                />
              )}
              <span className="truncate">{selectedItem.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground truncate">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="p-1 hover:bg-accent rounded"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="max-h-[250px] overflow-y-auto py-1">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                type="button"
                key={item.code}
                onClick={() => {
                  handleValueChange(item.code)
                  setOpen(false)
                  setSearch("")
                }}
                className={cn(
                  "w-full px-3 py-2 flex items-center gap-2 hover:bg-accent cursor-pointer text-left",
                  currentValue === item.code && "bg-accent"
                )}
              >
                <Check
                  className={cn(
                    "h-4 w-4 shrink-0",
                    currentValue === item.code ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center gap-2 truncate">
                  {item.color && (
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                  <span className="truncate">{item.name}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface FormComboboxProps extends ComboboxProps {
  name?: string
  title?: string
}

export function FormCombobox({
  name,
  title,
  value,
  defaultValue,
  onValueChange,
  items,
  placeholder,
  emptyMessage,
  className,
}: FormComboboxProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    value ?? defaultValue
  )
  const isControlled = value !== undefined
  const currentValue = (isControlled ? value : internalValue) || ""

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <span className="flex flex-col gap-1">
      {title && <span className="text-sm font-medium">{title}</span>}
      {name && <input type="hidden" name={name} value={currentValue} />}
      <Combobox
        value={currentValue}
        onValueChange={handleValueChange}
        items={items}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        className={className}
      />
    </span>
  )
}

interface MultiComboboxProps {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  items: CategoryItem[]
  placeholder?: string
  emptyMessage?: string
  className?: string
}

export function MultiCombobox({
  value,
  defaultValue,
  onValueChange,
  items,
  placeholder = "Select...",
  emptyMessage = "No item found.",
  className,
}: MultiComboboxProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(
    value ?? defaultValue ?? []
  )
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const selectedItems = items.filter((item) => currentValue.includes(item.code))

  const filteredItems = items.filter(
    (item) =>
      !currentValue.includes(item.code) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleValueChange = (newValue: string[]) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  const handleSelect = (code: string) => {
    handleValueChange([...currentValue, code])
    setSearch("")
    inputRef.current?.focus()
  }

  const handleRemove = (code: string) => {
    handleValueChange(currentValue.filter((c) => c !== code))
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setSearch("")
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          ref={containerRef}
          className={cn(
            "w-full min-h-[42px] flex flex-wrap items-center gap-1 px-3 py-2 border rounded-md bg-background cursor-pointer",
            open && "border-ring",
            className
          )}
        >
          {selectedItems.map((item) => (
            <Badge
              key={item.code}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {item.color && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-sm">{item.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(item.code)
                }}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedItems.length === 0 && (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="p-1 hover:bg-accent rounded"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="max-h-[250px] overflow-y-auto py-1">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                type="button"
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-accent cursor-pointer text-left"
              >
                <div className="flex items-center gap-2 truncate">
                  {item.color && (
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                  <span className="truncate">{item.name}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface FormMultiComboboxProps extends MultiComboboxProps {
  name?: string
  title?: string
}

export function FormMultiCombobox({
  name,
  title,
  value,
  defaultValue,
  onValueChange,
  items,
  placeholder,
  emptyMessage,
  className,
}: FormMultiComboboxProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(
    value ?? defaultValue ?? []
  )
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleValueChange = (newValue: string[]) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <span className="flex flex-col gap-1">
      {title && <span className="text-sm font-medium">{title}</span>}
      {name && (
        <>
          {currentValue.map((v) => (
            <input key={v} type="hidden" name={name} value={v} />
          ))}
        </>
      )}
      <MultiCombobox
        value={currentValue}
        onValueChange={handleValueChange}
        items={items}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        className={className}
      />
    </span>
  )
}
