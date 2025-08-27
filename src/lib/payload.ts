import { getPayload } from 'payload'
import config from '@payload-config'

let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { conn: null, promise: null }
}

export const getPayloadClient = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = getPayload({
      config,
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}