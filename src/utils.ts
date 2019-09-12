export const ensureArray = <T>(n?: T | T[]): T[] => n === undefined ? [] : Array.isArray(n) ? n : [n]

export const unnest = <T>(arr: T[][]): T[] => arr.reduce((a, n) => [...a, ...n], [])
