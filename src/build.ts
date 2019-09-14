const depTree = require("dependency-tree")
const fs = require("fs")

export const getBuildPath = (patch: string) => `./build/${patch}`

export const buildPatch = (entryFile: string, buildPath: string) => {
  const list = depTree.toList({
    filename: entryFile,
    directory: "./patches",
    tsConfig: "./tsconfig.json",
    filter: (path: string) => !path.includes("node_modules")
  }) as string[]

  const isPdModule = (x: any) =>
    typeof x === "function" && x.name === "PdModule"

  fs.mkdirSync(buildPath, { recursive: true })

  list.forEach(src => {
    const mod = require(src)
    const keys = Object.keys(mod).filter(key => isPdModule(mod[key]))
    if (keys.length > 0) {
      console.log(`Build ${src}:`)
    }
    keys.forEach(name => {
      const filename = `${buildPath}/${name}.pd`
      const code = mod[name].toString()
      console.log(filename)
      console.log()
      console.log(code)
      console.log()
      fs.writeFileSync(filename, code)
    })
  })
}

export const buildPatchCmd = (patch?: string) => {
  if (patch) {
    const entryFile = `./patches/${patch}/main.ts`
    const buildPath = getBuildPath(patch)
    if (fs.existsSync(entryFile)) {
      buildPatch(entryFile, buildPath)
    } else {
      console.error(`ERROR: ${entryFile} does not exist`)
    }
  } else {
    console.log("USAGE: yarn build [patchname]")
  }
}
