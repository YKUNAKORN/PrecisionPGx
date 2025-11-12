export interface UserModel {
    id: string
    email: string
    position: string
    fullname: string
    created_at: string
}

export const UserModel = {
    id: '',
    email: '',
    position: '',
    fullname: '',
    created_at: ''
}

export interface InsertUserModel {
    id: string
    email: string
    position: string
    fullname: string
}

export const InsertUserModel = {
    id: '',
    email: '',
    position: '',
    fullname: '',
}
