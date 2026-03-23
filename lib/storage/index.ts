import { User } from "@/prisma/client"
import * as local from "./local"
import * as supabase from "./supabase"

export type StorageProvider = "local" | "supabase"

const provider = (process.env.STORAGE_PROVIDER as StorageProvider) || "local"

export function storageKey(user: User, relativePath: string) {
  // Keep path normalized and user-scoped
  return `${user.email}/${relativePath}`
}

export async function uploadBuffer(user: User, relativePath: string, buffer: Buffer, contentType?: string) {
  if (provider === "supabase") return supabase.uploadBuffer(storageKey(user, relativePath), buffer, contentType)
  return local.uploadBuffer(user, relativePath, buffer)
}

export async function downloadToLocal(user: User, relativePath: string) {
  if (provider === "supabase") return supabase.downloadToLocal(user, relativePath)
  return local.downloadToLocal(user, relativePath)
}

export async function downloadBuffer(user: User, relativePath: string) {
  if (provider === "supabase") return supabase.downloadBuffer(storageKey(user, relativePath))
  return local.downloadBuffer(user, relativePath)
}

export async function moveFile(user: User, oldRelativePath: string, newRelativePath: string) {
  if (provider === "supabase") return supabase.moveFile(storageKey(user, oldRelativePath), storageKey(user, newRelativePath))
  return local.moveFile(user, oldRelativePath, newRelativePath)
}

export async function deleteFile(user: User, relativePath: string) {
  if (provider === "supabase") return supabase.deleteFile(storageKey(user, relativePath))
  return local.deleteFile(user, relativePath)
}

export async function removePrefix(user: User, prefix: string) {
  if (provider === "supabase") return supabase.removePrefix(`${user.email}/${prefix}`)
  return local.removePrefix(user, prefix)
}

export async function getPublicUrl(user: User, relativePath: string) {
  if (provider === "supabase") return supabase.getPublicUrl(storageKey(user, relativePath))
  return local.getPublicUrl(user, relativePath)
}
