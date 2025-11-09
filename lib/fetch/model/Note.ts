export interface Note {
    id: string;
    method: string;
    created_at: string;
}

export interface UpdateNote {
    method: string;
}

export const NoteExample: Note[] = [{
    id: '',
    method: '',
    created_at: ''
}];

export const UpdateNoteExample: UpdateNote = {
    method: ''
};
