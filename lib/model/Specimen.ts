export interface SpecimenType {
    name: string
    patient_id: string
    expire_in: number
}

export const Specimen: SpecimenType[] = [ {  //for result and delete
    name: "",
    patient_id: "",
    expire_in: 0,
} ]