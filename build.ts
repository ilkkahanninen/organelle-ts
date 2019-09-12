const depTree = require('dependency-tree')
const fs = require('fs')

const patch = 'test'
const buildPath = `./build/${patch}`

const list = depTree.toList({
  filename: `./patches/${patch}/main.ts`,
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
