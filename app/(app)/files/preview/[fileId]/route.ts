import { getCurrentUser } from "@/lib/auth"
import { fileExists, fullPathForFile } from "@/lib/files"
import * as storage from "@/lib/storage"
import { generateFilePreviews } from "@/lib/previews/generate"
import { getFileById } from "@/models/files"
import fs from "fs/promises"
import { NextResponse } from "next/server"
import path from "path"
import { encodeFilename } from "@/lib/utils"

export async function GET(request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params
  const user = await getCurrentUser()

  if (!fileId) {
    return new NextResponse("No fileId provided", { status: 400 })
  }

  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get("page") || "1", 10)

  try {
    // Find file in database
    const file = await getFileById(fileId, user.id)

    if (!file || file.userId !== user.id) {
      return new NextResponse("File not found or does not belong to the user", { status: 404 })
    }

    // Ensure original file exists locally (download from storage if needed)
    let fullFilePath = fullPathForFile(user, file)
    let isFileExists = await fileExists(fullFilePath)
    if (!isFileExists && process.env.STORAGE_PROVIDER === "supabase") {
      try {
        fullFilePath = await storage.downloadToLocal(user, file.path)
        isFileExists = await fileExists(fullFilePath)
      } catch (err) {
        return new NextResponse(`File not found in storage: ${file.path}`, { status: 404 })
      }
    }
    if (!isFileExists) {
      return new NextResponse(`File not found on disk: ${file.path}`, { status: 404 })
    }

    // Generate previews
    const { contentType, previews } = await generateFilePreviews(user, fullFilePath, file.mimetype)
    if (page > previews.length) {
      return new NextResponse("Page not found", { status: 404 })
    }
    const previewPath = previews[page - 1] || fullFilePath

    // Read file
    const fileBuffer = await fs.readFile(previewPath)

    // Return file with proper content type
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename*=${encodeFilename(path.basename(previewPath))}`,
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
