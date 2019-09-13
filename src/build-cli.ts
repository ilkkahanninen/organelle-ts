import { getBuildPath, buildPatch } from "./build"
import fs from "fs"

const patch = process.argv[2]
if (patch) {
  const entryFile = `./patches/${patch}/main.ts`
  const buildPath = getBuildPath(patch)
  if (fs.existsSync(entryFile)) {
    buildPatch(entryFile, buildPath)
  } else {
    console.error(`ERROR: ${entryFile} does not exist`)
  }
} else {
  console.log('USAGE: yarn build [patchname]')
}
