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

function isArgon2idHash(hash: string | null): boolean {
  return hash !== null && hash.startsWith("$argon2id$")
}

async function cleanPasswords() {
  console.log("🧹 Cleaning Argon2id password hashes...")

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
      console.log("✅ No Argon2id hashes found, nothing to clean")
      return
    }

    console.log(`Found ${argon2idAccounts.length} Argon2id hash(es), clearing...`)

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

    console.log(`✅ Cleaned ${result.count} Argon2id hash(es)`)
  } catch (error) {
    console.error("❌ Error cleaning passwords:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanPasswords()
