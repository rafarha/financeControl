import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ColoredText } from "@/components/ui/colored-text"
import { SetPasswordForm } from "@/components/auth/set-password-form"
import Image from "next/image"
import { Lock } from "lucide-react"

export default async function SetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            <ColoredText>Set Your Password</ColoredText>
          </CardTitle>
          <CardDescription>
            Create a password to enable login with email + password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SetPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
