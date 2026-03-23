import fs from "fs/promises"
import path from "path"
import os from "os"
import { User } from "@/prisma/client"
import { FILE_UPLOAD_PATH, safePathJoin, getUserUploadsDirectory } from "@/lib/files"

export async function uploadBuffer(user: User, relativePath: string, buffer: Buffer) {
  const userUploadsDirectory = getUserUploadsDirectory(user)
  const fullPath = safePathJoin(userUploadsDirectory, relativePath)
  await fs.mkdir(path.dirname(fullPath), { recursive: true })
  await fs.writeFile(fullPath, buffer)
  return { path: relativePath, url: getPublicUrl(user, relativePath), size: buffer.length }
}

export async function downloadToLocal(user: User, relativePath: string) {
  const userUploadsDirectory = getUserUploadsDirectory(user)
  const fullPath = safePathJoin(userUploadsDirectory, relativePath)
  await fs.mkdir(path.dirname(fullPath), { recursive: true })
  return fullPath
}

export async function downloadBuffer(user: User, relativePath: string) {
  const userUploadsDirectory = getUserUploadsDirectory(user)
  const fullPath = safePathJoin(userUploadsDirectory, relativePath)
  const data = await fs.readFile(fullPath)
  return Buffer.from(data)
}

export async function moveFile(user: User, oldRelativePath: string, newRelativePath: string) {
  const userUploadsDirectory = getUserUploadsDirectory(user)
  const oldFull = safePathJoin(userUploadsDirectory, oldRelativePath)
  const newFull = safePathJoin(userUploadsDirectory, newRelativePath)
  await fs.mkdir(path.dirname(newFull), { recursive: true })
  await fs.rename(oldFull, newFull)
}

export async function deleteFile(user: User, relativePath: string) {
  const userUploadsDirectory = getUserUploadsDirectory(user)
  const fullPath = safePathJoin(userUploadsDirectory, relativePath)
  await fs.rm(fullPath, { force: true })
}

export async function removePrefix(user: User, prefix: string) {
  const userUploadsDirectory = getUserUploadsDirectory(user)
  const fullPrefix = safePathJoin(userUploadsDirectory, prefix)
  await fs.rm(fullPrefix, { recursive: true, force: true })
}

export function getPublicUrl(user: User, relativePath: string) {
  // Local filesystem: return a path-like URL used internally
  return `file://${safePathJoin(getUserUploadsDirectory(user), relativePath)}`
}
