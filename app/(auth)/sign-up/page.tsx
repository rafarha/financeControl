import { SignUpForm } from "@/components/auth/sign-up-form"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ColoredText } from "@/components/ui/colored-text"
import config from "@/lib/config"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function SignUpPage() {
  if (config.selfHosted.isEnabled) {
    redirect(config.selfHosted.redirectUrl)
  }

  if (config.auth.disableSignup) {
    redirect("/enter")
  }

  return (
    <Card className="w-full max-w-xl mx-auto p-8 flex flex-col items-center justify-center gap-4">
      <Image src="/logo/512.png" alt="Logo" width={144} height={144} className="w-36 h-36" />
      <CardTitle className="text-3xl font-bold">
        <ColoredText>Create Your Account</ColoredText>
      </CardTitle>
      <p className="text-muted-foreground text-center">
        Join TaxHacker and take control of your finances
      </p>
      <CardContent className="w-full">
        <SignUpForm />
      </CardContent>
    </Card>
  )
}
