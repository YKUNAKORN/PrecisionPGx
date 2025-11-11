export const Role = {
  MEDTECH: 'medtech',
  PHARMACY: 'pharmacy', 
  DOCTOR: 'doctor'
} as const

const AUTH_REQUIRED_PATHS: string[] = [
  '/api/user',
  '/api/user/note',
]

const ROLE_HIERARCHY: Record<string, string[]> = {
  [Role.MEDTECH]: [Role.PHARMACY, Role.DOCTOR],
  [Role.PHARMACY]: [Role.DOCTOR],
  [Role.DOCTOR]: []
}

export function RequiresAuth(path: string): boolean {
  return AUTH_REQUIRED_PATHS.some(authPath => path.startsWith(authPath))
}

export function isMedtech(position: string): boolean {
  return position.toLowerCase() === Role.MEDTECH
}

export function isPharmacy(position: string): boolean {
  return position.toLowerCase() === Role.PHARMACY
}

export function isDoctor(position: string): boolean {
  return position.toLowerCase() === Role.DOCTOR
}

export function checkPermission(position: string, method: string, path: string): boolean {
  if (isMedtech(position)) return true
  const requiredPermission = `${method.toUpperCase()}:${path}`
  if (isPharmacy(position)) {
    const allowed = [
      'GET:/api/user/note*', 
      'POST:/api/user/note', 
      'PUT:/api/user/note', 
      'DELETE:/api/user/note', 
      'GET:/api/user', 
      'PATCH:/api/user/report/verify',
      // 'POST:/api/user'
    ]
    return allowed.some(p => p.includes('note') && path.includes('note') ? requiredPermission.startsWith(p) : p === requiredPermission)
  }
  if (isDoctor(position)) {
    const allowed = [
      'GET:/api/user/note*', 
      'POST:/api/user/note', 
      'PUT:/api/user/note', 
      'DELETE:/api/user/note',
      'GET:/api/user', 
    ]
    return allowed.some(p => requiredPermission.startsWith(p))
  }
  return false
}

export function hasHigherRole(userRole: string, targetRole: string): boolean {
  const userHierarchy = ROLE_HIERARCHY[userRole] || []
  return userHierarchy.includes(targetRole)
}