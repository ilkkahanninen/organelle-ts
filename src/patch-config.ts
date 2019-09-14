import fs from "fs"
import path from "path"

export type PatchConfig = {
  name: string
  entry: string
  folder?: string
}

export const loadConfig = (patch: string): PatchConfig => {
  const defaults: PatchConfig = {
    name: patch,
    entry: "main.ts"
  }
  const configFile = `./patches/${patch}/patch.json`
  if (fs.existsSync(configFile)) {
    const config = require(path.join(process.cwd(), configFile))
    return { ...defaults, ...config }
  }
  return defaults
}
