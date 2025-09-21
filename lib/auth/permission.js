export const Role = {
  MEDTECH: 'medtech',
  PHARMACY: 'pharmacy', 
  DOCTOR: 'doctor'
}

const AUTH_REQUIRED_PATHS = [
  '/api/user',
  '/api/user/note',
]

const ROLE_HIERARCHY = {
  [Role.MEDTECH]: [Role.PHARMACY, Role.DOCTOR],
  [Role.PHARMACY]: [Role.DOCTOR],
  [Role.DOCTOR]: []
}

const PERMISSIONS = {
  medtech: ['*'],
  pharmacy: [
    'GET:/api/user/note',
    'POST:/api/user/note', 
    'PUT:/api/user/note',
    'DELETE:/api/user/note',
    'GET:/api/user',
    'POST:/api/user'
  ],
  doctor: [
    'GET:/api/user/note',
    'POST:/api/user/note', 
    'PUT:/api/user/note',
    'DELETE:/api/user/note'
  ]
}

export function RequiresAuth(path) {
  return AUTH_REQUIRED_PATHS.some(authPath => path.startsWith(authPath))
}

export function checkPermission(userRole, method, path) {
  const userPermissions = PERMISSIONS[userRole] || []
    if (userPermissions.includes('*')) {
    return true
  }
  
  const requiredPermission = `${method}:${path}`
  return userPermissions.includes(requiredPermission)
}

export function hasHigherRole(userRole, targetRole) {
  const userHierarchy = ROLE_HIERARCHY[userRole] || []
  return userHierarchy.includes(targetRole)
}