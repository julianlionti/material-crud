export const compareKeys = <T extends object>(keys: (keyof T)[]) => (prev: T, next: T): boolean => {
  const subset = (ob: T) =>
    keys.reduce((o, k) => {
      o[k as string] = ob[k]
      return o
    }, {})
  const finalPrev = subset(prev)
  const finalNext = subset(next)

  try {
    return JSON.stringify(finalPrev) === JSON.stringify(finalNext)
  } catch {
    return false
  }
}

export const compareKeysOmit = <T extends object>(keys: (keyof T)[]) => (
  prev: T,
  next: T,
): boolean => {
  const allKeys = Object.keys(prev)
  const keystring = keys as string[]
  const keysout = allKeys.filter((x) => !keystring.includes(x as string)) as (keyof T)[]
  return compareKeys(keysout)(prev, next)
}
