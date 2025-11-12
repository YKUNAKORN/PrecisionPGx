export interface Note {
    id: string
    method: string
    created_at: string
}

export const Note = [{
    id: '',
    method: '',
    created_at: ''
}]

export interface UpdateNote {
    method: string
}

export const UpdateNote = {
    method: ''
}
