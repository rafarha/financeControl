"use server"

import { authClient } from "@/lib/auth-client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function revokeSessionAction(sessionToken: string) {
  const result = await authClient.revokeSession({
    token: sessionToken,
  })

  if (result.error) {
    throw new Error(result.error.message)
  }

  revalidatePath("/settings/sessions")
}

export async function signOutAllSessionsAction() {
  const result = await authClient.signOut()

  if (result.error) {
    throw new Error(result.error.message)
  }

  redirect("/enter")
}
