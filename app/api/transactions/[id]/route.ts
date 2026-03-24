import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getTransactionById } from "@/models/transactions"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const tx = await getTransactionById(params.id, user.id)
    if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Return the transaction as JSON. Keep shape minimal.
    return NextResponse.json(tx)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
