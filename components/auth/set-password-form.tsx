"use client"

import { FormError } from "@/components/forms/error"
import { FormInput } from "@/components/forms/simple"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function SetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to set password")
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set password")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          Password set successfully! Redirecting to dashboard...
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <p className="text-sm text-muted-foreground mb-2">
        Set a password to enable login with email + password. You can also continue using the email code method.
      </p>

      <FormInput
        title="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter a strong password"
        required
        minLength={8}
      />

      <FormInput
        title="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        required
        minLength={8}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Setting password..." : "Set Password"}
      </Button>

      {error && <FormError className="text-center">{error}</FormError>}
    </form>
  )
}
