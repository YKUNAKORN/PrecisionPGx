export interface Fridge {
    id: string
    name: string
    capacity: number
    item: number
    remaining: number
}

export interface FridgeUpdate {
    fridge_name: string
    capacity: number
    item: number
    remaining: number
}

export interface ReportCapacity {
    PercentRemaining: number
    Remaining: number
    Item: number
    Capacity: number
}

export const Fridge: any = []
export const ReportCapacity: any = {}
