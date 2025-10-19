export interface Note {
    id: string
    method: string
    created_at: string
}

export interface UpdateNote {
    method: string
}

export const Note: Note[] = [{
    id: '',
    method: '',
    created_at: ''
}]

export const UpdateNote: UpdateNote = {
    method: ''
}
