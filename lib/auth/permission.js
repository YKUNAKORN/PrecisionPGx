export const Role = {
  MEDTECH: 'medtech',
  PHARMACY: 'pharmacy', 
  DOCTOR: 'doctor'
}

const AUTH_REQUIRED_PATHS = [
  '/api/user',
  // '/api/user/note',
]

const ROLE_HIERARCHY = {
  [Role.MEDTECH]: [Role.PHARMACY, Role.DOCTOR],
  [Role.PHARMACY]: [Role.DOCTOR],
  [Role.DOCTOR]: []
}

export function RequiresAuth(path) {
  return AUTH_REQUIRED_PATHS.some(authPath => path.startsWith(authPath))
}

export function isMedtech(position) {
  return position.toLowerCase() === Role.MEDTECH
}

export function isPharmacy(position) {
  return position.toLowerCase() === Role.PHARMACY
}

export function isDoctor(position) {
  return position.toLowerCase() === Role.DOCTOR
}

export function checkPermission(position, method, path) {
  if (isMedtech(position)) return true
  const requiredPermission = `${method.toUpperCase()}:${path}`
  if (isPharmacy(position)) {
    const allowed = [
      'GET',
      'PATCH:/api/user/report/verify',
      'PUT:/api/user/user*',
      // 'POST:/api/user'
    ]
    return allowed.some(p => p.includes('') && path.includes('') ? requiredPermission.startsWith(p) : p === requiredPermission)
  }
  if (isDoctor(position)) {
    const allowed = [
      'GET'
    ]
    return allowed.some(p => requiredPermission.startsWith(p))
  }
  return false
}

export function hasHigherRole(userRole, targetRole) {
  const userHierarchy = ROLE_HIERARCHY[userRole] || []
  return userHierarchy.includes(targetRole)
}