export interface ResponseModel<T = any> {
    status: string;
    message: string;
    data: T | null;
}

export const ResponseModelExample: ResponseModel = {
    status: '',
    message: '',
    data: null
};
