import { getCurrentUser } from "@/lib/auth"
import { fileExists, getStaticDirectory, safePathJoin } from "@/lib/files"
import * as storage from "@/lib/storage"
import fs from "fs/promises"
import lookup from "mime-types"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  const user = await getCurrentUser()

  if (!filename) {
    return new NextResponse("No filename provided", { status: 400 })
  }

  const staticFilesDirectory = getStaticDirectory(user)

  try {
    const fullFilePath = safePathJoin(staticFilesDirectory, filename)
    let fileBuffer: Buffer
    const isFileExists = await fileExists(fullFilePath)
    if (isFileExists) {
      fileBuffer = await fs.readFile(fullFilePath)
    } else if (process.env.STORAGE_PROVIDER === "supabase") {
      try {
        fileBuffer = await storage.downloadBuffer(user, filename)
      } catch (err) {
        return new NextResponse(`File not found for user: ${filename}`, { status: 404 })
      }
    } else {
      return new NextResponse(`File not found for user: ${filename}`, { status: 404 })
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": lookup.lookup(filename) || "application/octet-stream",
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
