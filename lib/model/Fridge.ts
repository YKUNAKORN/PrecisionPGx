export interface FridgeType {
    id: string
    name: string
    capacity: number
    item: number
    remaining: number
}

export interface FridgeUpdateType {
    fridge_name: string
    capacity: number
    item: number
    remaining: number
}

export interface ReportCapacityType {
    PercentRemaining: number
    Remaining: number
    Item: number
    Capacity: number
}

export const Fridge: FridgeType[] = [{
    id: '',
    name: '',
    capacity: 0,
    item: 0,
    remaining: 0
}]

export const FridgeUpdate: FridgeUpdateType[] = [{
    fridge_name: '',
    capacity: 0,
    item: 0,
    remaining: 0
}]

export const ReportCapacity: ReportCapacityType = {
    PercentRemaining: 0,
    Remaining: 0,
    Item: 0,
    Capacity: 0
}