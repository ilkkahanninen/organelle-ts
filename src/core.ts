type PdElement<T extends readonly string[]> = {
  elementType: 'obj' | 'msg'
  ctorString: string,
  inletConnections: Connection[],
  out: Record<T[number], PortMapping>
}

type PortMapping = {
  element: PdElement<any>
  portIndex: number
}

type Connection = {
  source: PortMapping
  target: PortMapping
}

type Connectable = PdElement<any> | PortMapping // PdElement<any> means port mapping to port 0

type Connectables = Connectable | Connectable[]

type ConnectablesMap<T extends readonly string[]> = Partial<Record<T[number], Connectables>>

type PdConnection = [number, number, number, number]

type Value = number | string
type Tuple2 = [Value, Value]

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

const createPdElement = <I extends readonly string[], O extends readonly string[]>(
  elementType: PdElement<any>['elementType'],
  ctorString: Value,
  inletConnectables: ConnectablesMap<I>,
  inletNames: I,
  outletNames: O
): PdElement<O> => {
  const element = {
    elementType,
    ctorString: String(ctorString),
    inletConnections: [] as Connection[],
    out: {} as Record<O[number], PortMapping>
  }

  element.inletConnections = unnest(Object.keys(inletConnectables).map((inletName: I[number]) => {
    const target = { element, portIndex: inletNames.findIndex(name => name === inletName) }
    return connectablesToPortMappings(inletConnectables[inletName]).map(source => ({ source, target }))
  }))

  element.out = outletNames.reduce(
    (obj, key, index) => ({ ...obj, [key]: { element, portIndex: index } }),
    {} as Record<O[number], PortMapping>
  )

  return element
}

const toCtor = (name: string, value?: any) =>
  value === undefined
    ? name
    : `${name} ${ensureArray(value).join(' ')}`

const msgInlets = <const>['trigger']
const msgOutlets = <const>['value']

export const msg = (value: Value, inlets: Connectables): PdElement<typeof msgOutlets> => createPdElement(
  'msg',
  value,
  { trigger: inlets },
  msgInlets,
  msgOutlets
)

export const objCreator = <A extends readonly string[], B extends readonly string[]>(name: string, inletNames: A, outletNames: B) =>
  (inlets: ConnectablesMap<A> = {}, value: Value = ''): PdElement<B> => createPdElement(
    'obj',
    toCtor(name, value),
    inlets,
    inletNames,
    outletNames
  )

export const objCreator2 = <A extends readonly string[], B extends readonly string[]>(name: string, inletNames: A, outletNames: B) =>
  (inlets: ConnectablesMap<A> = {}, value: Tuple2): PdElement<B> => createPdElement(
    'obj',
    toCtor(name, value),
    inlets,
    inletNames,
    outletNames
  )

export const Inlet = objCreator('inlet', <const>[], <const>['value'])
export const Inlet$ = objCreator('inlet~', <const>[], <const>['stream'])
export const Outlet = objCreator('outlet', <const>['value'], <const>[])
export const Outlet$ = objCreator('outlet~', <const>['stream'], <const>[])

const parseConnections = (elements: PdElement<any>[]): PdConnection[] => unnest(
  elements.map(element =>
    element.inletConnections.map(connection => [
      elements.findIndex(e => e === connection.source.element),
      connection.source.portIndex,
      elements.findIndex(e => e === connection.target.element),
      connection.target.portIndex
    ])
  )
)

export const createModule = () => {
  const inlets: PdElement<any>[] = []
  const elements: PdElement<any>[] = []
  const outlets: PdElement<any>[] = []

  const push = <T>(arr: Array<T>, item: T): T => {
    arr.push(item)
    return item
  }

  const Module = <T extends readonly string[]>(element: PdElement<T>) => push(elements, element)
  Module.controlIn = () => push(inlets, Inlet())
  Module.streamIn = () => push(inlets, Inlet$())
  Module.controlOut = () => push(outlets, Outlet())
  Module.streamOut = () => push(outlets, Outlet$())

  Module.toString = () => {
    const padding = 20
    const xSpacing = 70
    const ySpacing = 40
    const elementsByRow = 8

    const rowCount = Math.ceil(elements.length / elementsByRow)
    const width = padding * 2 + xSpacing * elementsByRow
    const height = padding + (2 + rowCount) * ySpacing

    return [
      `#N canvas 100 100 ${width} ${height} 10;`,
      ...inlets.map((e, i) =>
        `#X ${e.elementType} ${padding + i * xSpacing} ${padding} ${e.ctorString};`),
      ...elements.map((e, i) =>
        `#X ${e.elementType} ${padding + (i % elementsByRow) * xSpacing} ${padding + ySpacing * (Math.floor(i / elementsByRow) + 1)} ${e.ctorString};`),
      ...outlets.map((e, i) =>
        `#X ${e.elementType} ${padding + i * xSpacing} ${padding + ySpacing * (rowCount + 1)} ${e.ctorString};`),
      ...parseConnections([...inlets, ...elements, ...outlets]).map(c =>
        `#X connect ${c.join(' ')};`)
    ].join("\r\n")
  }

  return Module
}
