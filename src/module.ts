import { objCreator, EmptySet, PdElement, withCreatePdElementHook } from "./core";
import { unnest } from "./utils";

type ModuleConstructor<I extends EmptySet, O extends EmptySet> = (ports: {
  inlets: Record<I[number], PdElement<EmptySet, readonly ["data"]>>,
  outlets: Record<O[number], PdElement<readonly ["data"], EmptySet>>,
}) => void

type PdConnection = [number, number, number, number]

const edgePortNames = <const>['data']
type EdgeSet = typeof edgePortNames
const Inlet = objCreator('inlet', <const>[], edgePortNames)
const Inlet$ = objCreator('inlet~', <const>[], edgePortNames)
const Outlet = objCreator('outlet', edgePortNames, <const>[])
const Outlet$ = objCreator('outlet~', edgePortNames, <const>[])

export const createModule = <I extends EmptySet, O extends EmptySet>(
  name: string,
  inletNames: I,
  outletNames: O,
  moduleCtor: ModuleConstructor<I, O>
) => {
  const streamPortRegex = /.*\$/
  const inlets: PdElement<EmptySet, EdgeSet>[] =
    inletNames.map(name => streamPortRegex.test(name) ? Inlet$() : Inlet())
  const outlets: PdElement<EdgeSet, EmptySet>[] =
    outletNames.map(name => streamPortRegex.test(name) ? Outlet$() : Outlet())
  const elements: PdElement<any, any>[] = []

  const listToRecord = <
    T extends EmptySet,
    I extends EmptySet,
    O extends EmptySet
  >(names: T, list: PdElement<I, O>[]) =>
    names.reduce(
      (obj, name, index) => ({ ...obj, [name]: list[index] }),
      {} as Record<T[number], PdElement<I, O>>
    )

  withCreatePdElementHook(
    element => elements.push(element),
    () => moduleCtor({
      inlets: listToRecord(inletNames, inlets),
      outlets: listToRecord(outletNames, outlets)
    })
  )

  const Module = objCreator(name, inletNames, outletNames)
  Object.defineProperty(Module, 'name', { value: 'PdModule', writable: false })

  Module.toString = () => {
    const padding = 20
    const xSpacing = 70
    const ySpacing = 40
    const elementsByRow = 8

    const rowCount = Math.ceil(elements.length / elementsByRow)
    const width = padding * 2 + xSpacing * elementsByRow
    const height = padding + (2 + rowCount) * ySpacing

    return [
      `#N canvas 100 100 ${width} ${height} 10`,
      ...inlets.map((e, i) =>
        `#X ${e.elementType} ${padding + i * xSpacing} ${padding} ${e.ctorString}`),
      ...elements.map((e, i) =>
        `#X ${e.elementType} ${padding + (i % elementsByRow) * xSpacing} ${padding + ySpacing * (Math.floor(i / elementsByRow) + 1)} ${e.ctorString}`),
      ...outlets.map((e, i) =>
        `#X ${e.elementType} ${padding + i * xSpacing} ${padding + ySpacing * (rowCount + 1)} ${e.ctorString}`),
      ...parseConnections([...inlets, ...elements, ...outlets]).map(c =>
        `#X connect ${c.join(' ')}`)
    ]
      .map(line => `${line.trim()};`)
      .join("\r\n")
  }

  return Module
}

export const createMainModule = (moduleCtor: ModuleConstructor<EmptySet, EmptySet>) => createModule("main", [], [], moduleCtor)

const findIndexOrThrow = <T>(list: T[], value: T) => {
  const index = list.findIndex(a => a === value)
  if (index < 0) {
    console.error('Could not find:', value)
    console.error('In array:', list)
    throw Error(`ERROR: Could not find value in array`)
  }
  return index
}

const parseConnections = (elements: PdElement<any, any>[]): PdConnection[] => unnest(
  elements.map(element =>
    element.inletConnections.map(connection => [
      findIndexOrThrow(elements, connection.source.element),
      connection.source.portIndex,
      findIndexOrThrow(elements, connection.target.element),
      connection.target.portIndex
    ])
  )
)
