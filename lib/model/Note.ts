export interface NoteType {
    id: string
    method: string
    created_at: string
}

export interface UpdateNoteType {
    method: string
}

export const Note: NoteType[] = [{
    id: '',
    method: '',
    created_at: ''
}]

export const UpdateNote: UpdateNoteType = {
    method: ''
}