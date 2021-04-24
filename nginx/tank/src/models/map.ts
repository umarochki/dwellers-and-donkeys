export interface MapFile {
    id: number
    file: string
    type: string
    name: string
    created: number
    creator: number
    hash: string
}

export interface Map {
    name: string
    file: string
    hash: string
}