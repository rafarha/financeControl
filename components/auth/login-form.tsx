"use client"

import { FormError } from "@/components/forms/error"
import { FormInput } from "@/components/forms/simple"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export function LoginForm({ defaultEmail }: { defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail || "")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp")
  const router = useRouter()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
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

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify the code")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })
      if (result.error) {
        setError(result.error.message || "Invalid email or password")
        return
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMethod = (method: "otp" | "password") => {
    setLoginMethod(method)
    setIsOtpSent(false)
    setOtp("")
    setPassword("")
    setError(null)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex border rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => toggleMethod("otp")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            loginMethod === "otp"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Email Code
        </button>
        <button
          type="button"
          onClick={() => toggleMethod("password")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            loginMethod === "password"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Password
        </button>
      </div>

      {loginMethod === "otp" ? (
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
            <FormInput
              title="Check your email for the verification code"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              pattern="[0-9]{6}"
            />
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : isOtpSent ? "Verify Code" : "Send Code"}
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
      ) : (
        <form onSubmit={handlePasswordSignIn} className="flex flex-col gap-4">
          <FormInput
            title="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            title="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign In"}
          </Button>
        </form>
      )}

      {error && <FormError className="text-center">{error}</FormError>}

      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
