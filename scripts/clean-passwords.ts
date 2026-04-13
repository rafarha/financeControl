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

async function cleanPasswords() {
  console.log("🧹 Cleaning invalid password hashes...")

  try {
    const result = await prisma.account.updateMany({
      where: {
        providerId: "credential",
        password: {
          not: null,
        },
      },
      data: {
        password: null,
      },
    })

    console.log(`✅ Cleaned ${result.count} password hash(es)`)
  } catch (error) {
    console.error("❌ Error cleaning passwords:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanPasswords()
