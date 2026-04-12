import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ColoredText } from "@/components/ui/colored-text"
import Image from "next/image"

export default async function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-xl mx-auto p-8 flex flex-col items-center justify-center gap-4">
      <Image src="/logo/512.png" alt="Logo" width={144} height={144} className="w-36 h-36" />
      <CardTitle className="text-3xl font-bold">
        <ColoredText>Reset Password</ColoredText>
      </CardTitle>
      <p className="text-muted-foreground text-center">
        Enter your email to receive a verification code
      </p>
      <CardContent className="w-full">
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  )
}
