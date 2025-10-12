import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key'
)

export async function generateToken(payload) {
  const claims = {
    userId: payload.userId,
    position: payload.position,  
    email: payload.email,
  }
  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
  return token
}

export async function verifyToken(token) {
  try {
    console.log('Verifying token with secret')
    const { payload } = await jwtVerify(token, JWT_SECRET)
    console.log('Token verified successfully:', payload)
    return payload
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return null
  }
}

export function decodeToken(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (error) {
    return null
  }
}

export function deleteToken() {
  try {
    console.log("Call delete Token function")
    return true
  } catch (error) {
    console.error('Error deleting token:', error)
    return false
  }
}