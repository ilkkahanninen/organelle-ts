type EmptySet = readonly []

type PdElement<I extends readonly string[], O extends readonly string[]> = {
  elementType: 'obj' | 'msg'
  ctorString: string,
  inletConnections: Connection[],
  out: Record<O[number], PortMapping>,
  connect: (c: ConnectablesMap<I>) => void
}

type PortMapping = {
  element: PdElement<any, any>
  portIndex: number
}

type Connection = {
  source: PortMapping
  target: PortMapping
}

type Connectable = PdElement<any, any> | PortMapping // PdElement<any> means port mapping to port 0

type Connectables = Connectable | Connectable[]

type ConnectablesMap<T extends readonly string[]> = Partial<Record<T[number], Connectables>>

type PdConnection = [number, number, number, number]

type Value = number | string
type Tuple2 = [Value, Value]

type ModuleConstructor<I extends readonly string[], O extends readonly string[]> = (ports: {
  inlets: Record<I[number], PdElement<readonly [], readonly ["data"]>>,
  outlets: Record<O[number], PdElement<readonly ["data"], readonly []>>,
}) => void

//

const ensureArray = <T>(n: T | T[]): T[] => Array.isArray(n) ? n : [n]

const unnest = <T>(arr: T[][]): T[] => arr.reduce((a, n) => [...a, ...n], [])

const isPortMapping = (o: any): o is PortMapping =>
  typeof o === 'object' && typeof o.element === 'object' && typeof o.portIndex === 'number'

const connectablesToPortMappings = (connectables: Connectables): PortMapping[] =>
  ensureArray(connectables)
    .map(connectable => isPortMapping(connectable)
      ? connectable
      : { element: connectable, portIndex: 0 }
    )

type CreatePdElementHook = (element: PdElement<any, any>) => void
let createPdElementHook: CreatePdElementHook = null
const withCreatePdElementHook = (hook: CreatePdElementHook, context: () => void) => {
  createPdElementHook = hook
  context()
  createPdElementHook = null
}

const createPdElement = <I extends readonly string[], O extends readonly string[]>(
  elementType: PdElement<any, any>['elementType'],
  ctorString: Value,
  inletConnectables: ConnectablesMap<I>,
  inletNames: I,
  outletNames: O
): PdElement<I, O> => {
  const element = {
    elementType,
    ctorString: String(ctorString),
    inletConnections: [] as Connection[],
    out: {} as Record<O[number], PortMapping>,
    connect: (_c: ConnectablesMap<I>) => { }
  }

  const connectablesToConnections = (connectables: ConnectablesMap<I>): Connection[] =>
    unnest(Object.keys(connectables).map((inletName: I[number]) => {
      const target = { element, portIndex: inletNames.findIndex(name => name === inletName) }
      return connectablesToPortMappings(connectables[inletName]).map(source => ({ source, target }))
    }))

  element.inletConnections = connectablesToConnections(inletConnectables)

  element.out = outletNames.reduce(
    (obj, key, index) => ({ ...obj, [key]: { element, portIndex: index } }),
    {} as Record<O[number], PortMapping>
  )

  element.connect = (connectables: ConnectablesMap<I>) =>
    element.inletConnections.push(...connectablesToConnections(connectables))

  if (createPdElementHook) {
    createPdElementHook(element)
  }

  return element
}

const toCtor = (name: string, value?: any) =>
  value === undefined
    ? name
    : `${name} ${ensureArray(value).join(' ')}`

const msgInlets = <const>['trigger']
const msgOutlets = <const>['value']

export const msg = (value: Value, inlets: Connectables): PdElement<typeof msgInlets, typeof msgOutlets> => createPdElement(
  'msg',
  value,
  { trigger: inlets },
  msgInlets,
  msgOutlets
)

export const objCreator = <A extends readonly string[], B extends readonly string[]>(name: string, inletNames: A, outletNames: B) =>
  (inlets: ConnectablesMap<A> = {}, value: Value = ''): PdElement<A, B> => createPdElement(
    'obj',
    toCtor(name, value),
    inlets,
    inletNames,
    outletNames
  )

export const objCreator2 = <A extends readonly string[], B extends readonly string[]>(name: string, inletNames: A, outletNames: B) =>
  (inlets: ConnectablesMap<A> = {}, value: Tuple2): PdElement<A, B> => createPdElement(
    'obj',
    toCtor(name, value),
    inlets,
    inletNames,
    outletNames
  )

const parseConnections = (elements: PdElement<any, any>[]): PdConnection[] => unnest(
  elements.map(element =>
    element.inletConnections.map(connection => [
      elements.findIndex(e => e === connection.source.element),
      connection.source.portIndex,
      elements.findIndex(e => e === connection.target.element),
      connection.target.portIndex
    ])
  )
)



const edgePortName = <const>['data']
const Inlet = objCreator('inlet', <const>[], edgePortName)
const Inlet$ = objCreator('inlet~', <const>[], edgePortName)
const Outlet = objCreator('outlet', edgePortName, <const>[])
const Outlet$ = objCreator('outlet~', edgePortName, <const>[])

export const createModule = <I extends readonly string[], O extends readonly string[]>(
  name: string,
  inletNames: I,
  outletNames: O,
  moduleCtor: ModuleConstructor<I, O>
) => {
  const streamPortRegex = /.*\$/
  const inlets: PdElement<readonly [], typeof edgePortName>[] =
    inletNames.map(name => streamPortRegex.test(name) ? Inlet$() : Inlet())
  const outlets: PdElement<typeof edgePortName, readonly []>[] =
    outletNames.map(name => streamPortRegex.test(name) ? Outlet$() : Outlet())
  const elements: PdElement<any, any>[] = []

  const listToRecord = <
    T extends readonly string[],
    I extends readonly string[],
    O extends readonly string[]
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
