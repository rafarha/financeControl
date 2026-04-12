import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateUser } from "@/models/users"

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser()
    const body = await request.json()

    const { name, avatar } = body

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (avatar !== undefined) updateData.avatar = avatar

    const updatedUser = await updateUser(user.id, updateData)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}
