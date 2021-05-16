
export interface Hero {
    id: string
    name: string
    description: string
    race: string
    sex: string
    sprite: string
}

export interface AddHeroPayload {
    type: 'hero'
    id: number
    name: string
    description: string
    race: string
    sex: string
    sprite: string
    xy: [number, number]
}