import { PrismaClient } from "../prisma/client/index.js"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
        || process.env.POSTGRES_URL_NON_POOLING
        || process.env.POSTGRES_PRISMA_URL,
    },
  },
})

function isValidBetterAuthHash(hash: string | null): boolean {
  if (!hash) return false
  const parts = hash.split(":")
  return parts.length === 2 && parts[0].length === 32 && parts[1].length === 128
}

async function cleanPasswords() {
  console.log("🧹 Cleaning invalid password hashes (not using better-auth scrypt format)...")

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
      console.log("✅ All passwords use valid better-auth scrypt format")
      return
    }

    console.log(`Found ${invalidAccounts.length} invalid hash(es), clearing...`)

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

    console.log(`✅ Cleaned ${result.count} invalid hash(es)`)
  } catch (error) {
    console.error("❌ Error cleaning passwords:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanPasswords()
