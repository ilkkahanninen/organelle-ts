import fs from "fs"
import { promisify } from "util";
import { createOrganelleFileClient } from "./organelle-file-client";
import { getBuildPath, buildPatch, buildPatchCmd } from "./build";

const readDir = promisify(fs.readdir)

async function uploadPatch(deviceAdress: string, patch: string) {
  const client = createOrganelleFileClient(deviceAdress)

  const targetPath = `/sdcard/Patches/${patch}`
  const buildPath = getBuildPath(patch)
  const files = (await readDir(buildPath))
    .map(file => `${buildPath}/${file}`)

  console.log(`Creating path ${targetPath}`)
  await client.createPath(targetPath)
  console.log('Uploading files')
  console.log(files.map(file => `    ${file}`).join("\n"))
  await client.uploadFiles(targetPath, files)
}

const patch = process.argv[2]
const address = process.argv[3]

if (patch && address) {
  buildPatchCmd(patch)
  uploadPatch(address, patch)
} else {
  console.log('USAGE: yarn deploy [patch name] [device address]')
}
