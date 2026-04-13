import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ColoredText } from "@/components/ui/colored-text"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"

export default async function SignUpPage() {
  return (
    <Card className="w-full max-w-xl mx-auto p-8 flex flex-col items-center justify-center gap-4">
      <Image src="/logo/512.png" alt="Logo" width={144} height={144} className="w-36 h-36" />
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold">
          <ColoredText>Coming Soon</ColoredText>
        </CardTitle>
        <CardDescription className="text-center">
          Account registration will be available soon. Please contact the administrator if you need access.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <div className="flex flex-col gap-4">
          <Link href="/enter">
            <Button className="w-full" variant="outline">
              Back to Login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
