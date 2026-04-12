import { prisma } from "@/lib/db"

export async function ensureCredentialAccount(userId: string) {
  const existingAccount = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "credential",
    },
  })

  if (!existingAccount) {
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: userId,
        providerId: "credential",
        userId,
      },
    })
  }

  return existingAccount
}

export async function hasCredentialAccount(userId: string): Promise<boolean> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "credential",
    },
  })
  return !!account?.password
}

export async function hasPassword(userId: string): Promise<boolean> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "credential",
    },
  })
  return !!account?.password
}
