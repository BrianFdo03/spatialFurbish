export type TextureType = "none" | "wood" | "brick" | "tile" | "wallpaper"

export interface RoomProps {
    wallColor: string
    wallTexture: TextureType
    floorColor: string
    floorTexture: TextureType
    wallHeight: number
}
