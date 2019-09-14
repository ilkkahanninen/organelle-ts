export const ensureArray = <T>(n?: T | T[]): T[] =>
  n === undefined ? [] : Array.isArray(n) ? n : [n]

export const unnest = <T>(arr: T[][]): T[] =>
  arr.reduce((a, n) => [...a, ...n], [])

export const times = <T>(count: number, fn: (index: number) => T) =>
  Array(count)
    .fill(0)
    .map((_, i) => fn(i))
