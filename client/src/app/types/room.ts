export type TextureType =
    | "wall-1"
    | "wall-2"
    | "wall-3"
    | "floor-1"
    | "floor-2"
    | "floor-3"

export interface RoomProps {
    wallColor: string
    wallTexture: TextureType
    floorColor: string
    floorTexture: TextureType
    wallHeight: number
    lightsOn: boolean
}
