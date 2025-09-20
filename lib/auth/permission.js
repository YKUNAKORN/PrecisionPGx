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
  doctor: [
    'GET:/api/user/note',
    'POST:/api/user/note', 
    'PUT:/api/user/note',
    'DELETE:/api/user/note'
  ],
  patient: [
    'GET:/api/user/note'
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