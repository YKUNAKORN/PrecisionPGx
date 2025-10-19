export interface UserModel {
    id: string
    email: string
    position: string
    fullname: string
    created_at: string
}

export interface InsertUserModel {
    id: string
    email: string
    position: string
    fullname: string
}

export const UserModel: UserModel = {
    id: '',
    email: '',
    position: '',
    fullname: '',
    created_at: ''
}

export const InsertUserModel: InsertUserModel = {
    id: '',
    email: '',
    position: '',
    fullname: '',
}
