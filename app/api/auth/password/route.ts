import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { ensureCredentialAccount } from "@/lib/account"
import { prisma } from "@/lib/db"
import { hashPassword } from "better-auth/crypto"

export async function PATCH(request: Request) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { password } = await request.json()

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    await ensureCredentialAccount(session.user.id)

    const hashedPassword = await hashPassword(password)

    await prisma.account.updateMany({
      where: {
        userId: session.user.id,
        providerId: "credential",
      },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting password:", error)
    return NextResponse.json({ error: "Failed to set password" }, { status: 500 })
  }
}
