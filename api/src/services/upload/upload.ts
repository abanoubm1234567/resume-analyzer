import type { MutationResolvers } from 'types/graphql'
import { createWriteStream } from 'fs'
import path from 'path'

export const resumeUpload: MutationResolvers['resumeUpload'] = async ({ input }) => {
  const { filename, mimetype, createReadStream } = input

  // Validate file type.
  if (mimetype !== 'application/pdf') {
    return {
      message: null,
      status: 'error',
      error: 'Invalid file type. Only PDF files are allowed.'
    }
  }

  // Validate file size.
  const MAX_FILE_SIZE = 2 * 1024 * 1024
  const stream = createReadStream()
  let totalBytes = 0
  stream.on('data', (chunk) => {
    totalBytes += chunk.length
    if (totalBytes > MAX_FILE_SIZE) {
      stream.destroy()
    }
  })

  // Store it.
  const savePath = path.join(__dirname, '../../uploads', filename)
  await new Promise((resolve, reject) => {
    const writeStream = createWriteStream(savePath)
    stream.pipe(writeStream)
    stream.on('error', reject)
    stream.on('close', resolve)
  })

  return {
    message: "Resume uploaded successfully.",
    status: "success",
    error: null,
  }
}