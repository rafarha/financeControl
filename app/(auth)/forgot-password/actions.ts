"use server"

import { prisma } from "@/lib/db"
import { getUserByEmail } from "@/models/users"
import { ensureCredentialAccount } from "@/lib/account"
import { Argon2id } from "oslo/password"

export async function resetPasswordAction(
  email: string,
  newPassword: string,
  otp: string
) {
  const user = await getUserByEmail(email)
  if (!user) {
    throw new Error("User not found")
  }

  await ensureCredentialAccount(user.id)

  const hashedPassword = await new Argon2id().hash(newPassword)

  await prisma.account.updateMany({
    where: {
      userId: user.id,
      providerId: "credential",
    },
    data: {
      password: hashedPassword,
    },
  })

  return { success: true }
}
