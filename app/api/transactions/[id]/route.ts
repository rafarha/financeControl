import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getTransactionById } from "@/models/transactions"

export async function GET(_req: Request, context: any) {
  try {
    const params = (context && context.params) || {}
    const id = params.id as string | undefined

    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!id) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const tx = await getTransactionById(id, user.id)
    if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Return the transaction as JSON. Keep shape minimal.
    return NextResponse.json(tx)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
