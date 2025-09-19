import { NextResponse } from 'next/server'

export const Role = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  GUEST: 'guest'
}

const AUTH_REQUIRED_PATHS = [
  '/api/user',
  '/api/user/note',
]

const ROLE_HIERARCHY = {
  [Role.ADMIN]: [Role.DOCTOR, Role.PATIENT, Role.GUEST],
  [Role.DOCTOR]: [Role.PATIENT, Role.GUEST],
  [Role.PATIENT]: [Role.GUEST],
  [Role.GUEST]: []
}

const PERMISSIONS = {
  admin: ['*'],
  user: [
    'GET:/api/user/note',
    'POST:/api/user/note', 
    'PUT:/api/user/note',
    'DELETE:/api/user/note'
  ],
  guest: [
    'GET:/api/user/note'
  ]
}

export function RequiresAuth(path) {
  return AUTH_REQUIRED_PATHS.some(authPath => path.startsWith(authPath))
}

function RoleHasPrivilegeOver(role1, role2) {
  return role1 === role2 || ROLE_HIERARCHY[role1]?.includes(role2)
}

export function HasPermission(path, method, userRole) {
  const matchedPath = Object.keys(PERMISSIONS).find(permPath => path === permPath || path.startsWith(`${permPath}/`))
  if (!matchedPath) return true
  const allowedRoles = PERMISSIONS[matchedPath][method]
  if (!allowedRoles || allowedRoles.length === 0) return false 
  return allowedRoles.some(role => RoleHasPrivilegeOver(userRole, role))
}

export function checkPermission(userRole, method, path) {
  const userPermissions = PERMISSIONS[userRole] || []
  
  if (userPermissions.includes('*')) {
    return true
  }
  
  const requiredPermission = `${method}:${path}`
  return userPermissions.includes(requiredPermission)
}

export function hasRole(userRole, requiredRoles) {
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole)
  }
  return userRole === requiredRoles
}

export function CreateUnauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { success: false, message }, { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } }
  )
}

export function CreateForbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { success: false, message }, { status: 403 }
  )
}