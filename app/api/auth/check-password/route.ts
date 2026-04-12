import { NextResponse } from "next/server"
import { getUserByEmail } from "@/models/users"
import { hasPassword } from "@/lib/account"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 })
  }

  const user = await getUserByEmail(email)
  if (!user) {
    return NextResponse.json({ hasPassword: false, exists: false })
  }

  const passwordExists = await hasPassword(user.id)

  return NextResponse.json({
    hasPassword: passwordExists,
    exists: true,
  })
}
