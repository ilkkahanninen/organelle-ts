const depTree = require('dependency-tree')
const fs = require('fs')

export const buildPatch = (entryFile: string, buildPath: string) => {
  const list = depTree.toList({
    filename: entryFile,
    directory: './patches',
    tsConfig: './tsconfig.json',
    filter: (path: string) => !path.includes('node_modules') && !path.includes('src')
  }) as string[]

  const isPdModule = (x: any) => typeof x === 'function' && x.name === 'PdModule'

  fs.mkdirSync(buildPath, { recursive: true });

  list.forEach(src => {
    const mod = require(src)
    console.log(mod)
    Object.keys(mod)
      .filter(key => isPdModule(mod[key]))
      .forEach(name => {
        fs.writeFileSync(`${buildPath}/${name}.pd`, mod[name].toString())
      })
  })
}

const patch = process.argv[2]
if (patch) {
  const entryFile = `./patches/${patch}/main.ts`
  const buildPath = `./build/${patch}`
  if (fs.existsSync(entryFile)) {
    buildPatch(entryFile, buildPath)
  } else {
    console.error(`ERROR: ${entryFile} does not exist`)
  }
} else {
  console.log('USAGE: yarn build [patchname]')
}
