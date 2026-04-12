"use client"

import { FormError } from "@/components/forms/error"
import { FormInput } from "@/components/forms/simple"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { resetPasswordAction } from "@/app/(auth)/forgot-password/actions"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState<"email" | "otp" | "success">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      })
      if (result.error) {
        setError(result.error.message || "Failed to send the code")
        return
      }
      setStep("otp")
      setMessage("Check your email for the verification code")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send the code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      // Verify the OTP first
      const verifyResult = await authClient.emailOtp.checkVerificationOtp({
        email,
        otp,
        type: "forget-password",
      })
      
      if (verifyResult.error) {
        setError(verifyResult.error.message || "Invalid or expired code")
        setIsLoading(false)
        return
      }

      // OTP verified, now reset the password
      const resetResult = await resetPasswordAction(email, newPassword, otp)
      
      setStep("success")
      setMessage("Password reset successfully! You can now sign in with your new password.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "success") {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          {message}
        </div>
        <Link href="/enter">
          <Button className="w-full">
            Go to Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground mb-2">
            Enter your email address and we'll send you a verification code to reset your password.
          </p>

          <FormInput
            title="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground mb-2">
            Enter the verification code sent to <strong>{email}</strong> and your new password.
          </p>

          <FormInput
            title="Verification Code"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            pattern="[0-9]{6}"
          />

          <FormInput
            title="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />

          <FormInput
            title="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setStep("email")
              setOtp("")
              setError(null)
            }}
          >
            Use a different email
          </Button>
        </form>
      )}

      {error && <FormError className="text-center">{error}</FormError>}

      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/enter" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
