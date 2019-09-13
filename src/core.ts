import { ensureArray, unnest } from "./utils";

export type EmptySet = readonly string[]

export type PdElement<I extends EmptySet, O extends EmptySet> = {
  elementType: 'obj' | 'msg'
  ctorString: string,
  inletConnections: Connection[],
  out: Record<O[number], PortMapping>,
  connect: (c: ConnectablesMap<I>) => void
}

export type PortMapping = {
  element: PdElement<any, any>
  portIndex: number
}

export type Connection = {
  source: PortMapping
  target: PortMapping
}

type Connectable = PdElement<any, any> | PortMapping

type Connectables = Connectable | Connectable[]

type ConnectablesMap<T extends EmptySet> = Partial<Record<T[number], Connectables>>

type Value = number | string
type Tuple2 = [Value, Value]

//

const isPortMapping = (o: any): o is PortMapping =>
  typeof o === 'object' &&
  typeof o.element === 'object' &&
  typeof o.portIndex === 'number'

const isPdElement = (o: any): o is PdElement<any, any> =>
  typeof o === 'object' &&
  (o.elementType === 'obj' || o.elementType === 'msg') &&
  Array.isArray(o.inletConnections) &&
  typeof o.out === 'object' &&
  typeof o.connect === 'function'

const isConnectablesMap = (o: any): o is ConnectablesMap<any> =>
  typeof o === 'object' &&
  !Array.isArray(o) &&
  Object.values(o).every(n =>
    isPdElement(n) ||
    isPortMapping(n) ||
    (Array.isArray(n) && n.every(m => isPdElement(m) || isPortMapping(m)))
  )

const connectablesToPortMappings = (connectables?: Connectables): PortMapping[] =>
  ensureArray(connectables)
    .map(connectable => isPortMapping(connectable)
      ? connectable
      : { element: connectable, portIndex: 0 }
    )

type CreatePdElementHook = (element: PdElement<any, any>) => void
let createPdElementHook: CreatePdElementHook | null = null

export const withCreatePdElementHook = (hook: CreatePdElementHook, context: () => void) => {
  createPdElementHook = hook
  context()
  createPdElementHook = null
}

const formatCtorString = (input: string | number): string =>
  typeof input === 'string'
    ? input.replace(/(\$\d+)/g, (_m, x) => `\\${x}`)
    : String(input)

const createPdElement = <I extends EmptySet, O extends EmptySet>(
  elementType: PdElement<any, any>['elementType'],
  ctorString: Value,
  inletConnectables: ConnectablesMap<I> | Connectables,
  inletNames: I,
  outletNames: O
): PdElement<I, O> => {
  const element = {
    elementType,
    ctorString: formatCtorString(ctorString),
    inletConnections: [] as Connection[],
    out: {} as Record<O[number], PortMapping>,
    connect: (_c: ConnectablesMap<I>) => { }
  }

  const connectablesToConnections = (connectables: ConnectablesMap<I> | Connectables): Connection[] =>
    isConnectablesMap(connectables)
      ? unnest(Object.keys(connectables).map((inletName: I[number]) => {
        const portIndex = inletNames.findIndex(name => name === inletName)
        if (portIndex < 0) {
          console.error('Invalid port mapping detected in:')
          console.error(connectables)
          throw Error(`Unexpected error: Could not connect to unknown inlet '${inletName}'`)
        }
        const target = { element, portIndex }
        return connectablesToPortMappings(connectables[inletName]).map(source => ({ source, target }))
      }))
      : connectablesToPortMappings(connectables).map(source => ({ source, target: { element, portIndex: 0 } }))

  element.inletConnections = connectablesToConnections(inletConnectables)

  element.out = outletNames.reduce(
    (obj, key, index) => ({ ...obj, [key]: { element, portIndex: index } }),
    {} as Record<O[number], PortMapping>
  )

  element.connect = (connectables: ConnectablesMap<I> | Connectables) =>
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

export const objCreator = <A extends EmptySet, B extends EmptySet>(name: string, inletNames: A, outletNames: B) =>
  (inlets: ConnectablesMap<A> | Connectables = {}, value: Value = ''): PdElement<A, B> => createPdElement(
    'obj',
    toCtor(name, value),
    inlets,
    inletNames,
    outletNames
  )

export const objCreator2 = <A extends EmptySet, B extends EmptySet>(name: string, inletNames: A, outletNames: B) =>
  (inlets: ConnectablesMap<A> | Connectables = {}, value: Tuple2): PdElement<A, B> => createPdElement(
    'obj',
    toCtor(name, value),
    inlets,
    inletNames,
    outletNames
  )
