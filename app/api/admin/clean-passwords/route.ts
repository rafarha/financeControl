import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

function isArgon2idHash(hash: string | null): boolean {
  return hash !== null && hash.startsWith("$argon2id$")
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

    const argon2idAccounts = accounts.filter((a) => isArgon2idHash(a.password))

    if (argon2idAccounts.length === 0) {
      return NextResponse.json({
        message: "No Argon2id hashes found",
        cleaned: 0
      })
    }

    const result = await prisma.account.updateMany({
      where: {
        id: {
          in: argon2idAccounts.map((a) => a.id),
        },
      },
      data: {
        password: null,
      },
    })

    return NextResponse.json({
      message: "Cleaned Argon2id hashes",
      cleaned: result.count
    })
  } catch (error) {
    console.error("Error cleaning passwords:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
