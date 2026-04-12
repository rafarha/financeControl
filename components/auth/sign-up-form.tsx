"use client"

import { FormError } from "@/components/forms/error"
import { FormInput } from "@/components/forms/simple"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.signUp.email({
        email,
        password: "temporary-password-will-be-set-later",
        name: email.split("@")[0],
      })
      if (result.error) {
        setError(result.error.message || "Failed to send the code")
        return
      }
      setIsOtpSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send the code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.signIn.emailOtp({
        email,
        otp,
      })
      if (result.error) {
        setError("The code is invalid or expired")
        return
      }

      // If name was provided, update the user profile
      if (name.trim()) {
        await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        })
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify the code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="flex flex-col gap-4">
        <FormInput
          title="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isOtpSent}
        />

        {isOtpSent && (
          <>
            <FormInput
              title="Your Name (optional)"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we call you?"
            />

            <FormInput
              title="Check your email for the verification code"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              pattern="[0-9]{6}"
            />
          </>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : isOtpSent ? "Create Account" : "Continue"}
        </Button>

        {isOtpSent && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsOtpSent(false)
              setOtp("")
            }}
          >
            Use a different email
          </Button>
        )}
      </form>

      {error && <FormError className="text-center">{error}</FormError>}

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/enter" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
