export const getTextures = async () => {
  const res = await fetch("http://localhost:3000/api/textures")

  const data = await res.json()

  return data.data
}