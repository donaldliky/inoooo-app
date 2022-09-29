export const shortDisplay = (origin: string) => {
  return origin.slice(0, 4) + '...' + origin.slice(origin.length - 4, origin.length)
}