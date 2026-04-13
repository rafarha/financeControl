import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

function isValidBetterAuthHash(hash: string | null): boolean {
  if (!hash) return false
  const parts = hash.split(":")
  return parts.length === 2 && parts[0].length === 32 && parts[1].length === 128
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")

  if (secret !== process.env.BETTER_AUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const accounts = await prisma.account.findMany({
      where: {
        providerId: "credential",
        password: {
          not: null,
        },
      },
      select: {
        id: true,
        password: true,
      },
    })

    const invalidAccounts = accounts.filter((a) => !isValidBetterAuthHash(a.password))

    if (invalidAccounts.length === 0) {
      return NextResponse.json({
        message: "All passwords use valid better-auth scrypt format",
        cleaned: 0
      })
    }

    const result = await prisma.account.updateMany({
      where: {
        id: {
          in: invalidAccounts.map((a) => a.id),
        },
      },
      data: {
        password: null,
      },
    })

    return NextResponse.json({
      message: "Cleaned invalid password hashes",
      cleaned: result.count
    })
  } catch (error) {
    console.error("Error cleaning passwords:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
