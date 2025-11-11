export interface UserModelType {
    id: string
    email: string
    position: string
    fullname: string
    created_at: string
}

export interface InsertUserModelType {
    id: string
    email: string
    position: string
    fullname: string
}

export const UserModel: UserModelType = {
    id: '',
    email: '',
    position: '',
    fullname: '',
    created_at: ''
}

export const InsertUserModel: InsertUserModelType = {
    id: '',
    email: '',
    position: '',
    fullname: '',
}