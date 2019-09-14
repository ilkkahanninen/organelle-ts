import { getBuildPath, buildPatch } from "./build"
import { loadConfig } from "./patch-config"
import fs from "fs"

const patch = process.argv[2]
if (patch) {
  const config = loadConfig(patch)
  const entryFile = `./patches/${patch}/${config.entry}`

  const buildPath = getBuildPath(patch)
  if (fs.existsSync(entryFile)) {
    buildPatch(entryFile, buildPath)
  } else {
    console.error(`ERROR: ${entryFile} does not exist`)
  }
} else {
  console.log("USAGE: yarn build [patchname]")
}
