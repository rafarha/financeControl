import { createClient } from "@supabase/supabase-js"
import fs from "fs/promises"
import path from "path"
import os from "os"
import { User } from "@/prisma/client"

const SUPABASE_URL = process.env.SUPABASE_URL || ""
const SUPABASE_KEY = process.env.SUPABASE_KEY || ""
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "uploads"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function uploadBuffer(key: string, buffer: Buffer, contentType?: string) {
  // key is expected to be user-scoped, e.g. 'user@example.com/unsorted/uuid.pdf'
  try {
    // Supabase client expects a File/Blob/ReadableStream in some runtimes.
    // Convert Node Buffer -> Blob when available to avoid invalid content-type issues.
    let payload: any = buffer
    try {
      if (typeof Blob !== "undefined" && Buffer.isBuffer(buffer)) {
        // Convert Buffer -> Uint8Array first to satisfy Blob constructor typing in Node
  const uint8 = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
  payload = new Blob([uint8 as any], { type: contentType || undefined } as any)
      }
    } catch (e) {
      // ignore conversion errors and fall back to Buffer
      payload = buffer
    }

    const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(key, payload, {
      contentType: contentType || undefined,
      upsert: false,
    } as any)
    if (error) throw error
  } catch (err: any) {
    // Surface more helpful message for 415 from Supabase
    if (err && err.status === 415) {
      throw new Error(`StorageApiError: Invalid Content-Type header when uploading ${key} (${contentType})`)
    }
    throw err
  }
  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key)
  const publicUrl = (data as any)?.publicUrl || null
  return { path: key, url: publicUrl, size: buffer.length }
}

export async function downloadBuffer(key: string) {
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).download(key)
  if (error) throw error
  const arrayBuffer = await data.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export async function downloadToLocal(user: User, relativePath: string) {
  const key = `${user.email}/${relativePath}`
  const buffer = await downloadBuffer(key)
  const tmpDir = path.join(os.tmpdir(), "taxhacker", user.email)
  await fs.mkdir(path.dirname(path.join(tmpDir, relativePath)), { recursive: true })
  const localPath = path.join(tmpDir, relativePath)
  await fs.writeFile(localPath, buffer)
  return localPath
}

export async function moveFile(oldKey: string, newKey: string) {
  // Supabase doesn't have atomic move, do copy then remove
  const buffer = await downloadBuffer(oldKey)
  await uploadBuffer(newKey, buffer)
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([oldKey])
  if (error) throw error
}

export async function deleteFile(key: string) {
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([key])
  if (error) throw error
}

export async function removePrefix(prefix: string) {
  // List objects and delete them
  const listRes = await supabase.storage.from(SUPABASE_BUCKET).list(prefix, { limit: 1000, offset: 0 })
  if (listRes.error) throw listRes.error
  const toRemove = listRes.data.map((i: any) => `${prefix}/${i.name}`)
  if (toRemove.length === 0) return
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove(toRemove)
  if (error) throw error
}

export function getPublicUrl(key: string) {
  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key)
  return (data as any)?.publicUrl || null
}
