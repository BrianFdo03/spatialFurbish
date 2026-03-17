export interface FurnitureDef {
    id: string
    name: string
    category: string
    price: number
    image: string
    model: string
    w: number  // metres
    d: number  // metres
    size: string
    allowedColors: string[]
    allowedTextures: string[]
}

export interface PlacedItem extends FurnitureDef {
    instanceId: string
    x: number // pixels in canvas
    y: number // pixels in canvas
    rotation: number // degrees
    color: string
    texture?: string
}

export interface Furniture {
    id: string
    type: string
    position: [number, number, number]
    color: string
}