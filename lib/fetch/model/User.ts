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

export interface getdetailUserModel {
    id: string;
    email: string;
    fullname: string;
    position: string;
    created_at?: string;
    phone?: string;
    license_number?: string;
    ward_id?: string;
    ward?: Ward;
}

export interface Ward {
    name: string;
}
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


export interface UpdateUser {
    status: string;
    massage: string;   
    data: object;
}