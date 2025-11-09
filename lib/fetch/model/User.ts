export interface UserModel {
    id: string;
    email: string;
    position: string;
    fullname: string;
    created_at: string;
}

export interface InsertUserModel {
    id: string;
    email: string;
    position: string;
    fullname: string;
}

export const UserModelExample: UserModel = {
    id: '',
    email: '',
    position: '',
    fullname: '',
    created_at: ''
};

export const InsertUserModelExample: InsertUserModel = {
    id: '',
    email: '',
    position: '',
    fullname: '',
};
