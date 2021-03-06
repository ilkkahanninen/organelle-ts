import {
  Poly,
  Pack,
  Route,
  VariablePort,
  Add$,
  Bang,
  Int,
  Mod,
  Add
} from "@pd/objects"
import {
  Connectables,
  PdElement,
  PortMapping,
  msg,
  Connectable
} from "@pd/core"

const createPolyRouter = (
  polyphony: number,
  voiceStealing: number,
  input: Connectables
) => {
  const poly = Poly(input, `${polyphony} ${voiceStealing}`)
  return Route(
    Pack("0 0 0", poly.out.index, poly.out.note, poly.out.velocity),
    Array(polyphony)
      .fill(0)
      .map((_, i) => i + 1)
      .join(" ")
  )
}

export const polyphonic = (
  polyphony: number,
  voiceStealing: number,
  input: Connectables,
  elementBuilder: (notes: PortMapping) => PdElement<any, any>
) => {
  const route = createPolyRouter(polyphony, voiceStealing, input)
  const mix = Add$()

  for (let i = 0; i < polyphony; i++) {
    const port = `p${i}` as VariablePort
    const elem = elementBuilder(route.out[port])
    mix.connect({ left$: elem })
  }

  return mix
}

export const polyphonicStereo = (
  polyphony: number,
  voiceStealing: number,
  input: Connectables,
  elementBuilder: (
    notes: PortMapping
  ) => PdElement<any, readonly ["left$", "right$"]>
) => {
  const route = createPolyRouter(polyphony, voiceStealing, input)
  const left = Add$()
  const right = Add$()

  for (let i = 0; i < polyphony; i++) {
    const port = `p${i}` as VariablePort
    const elem = elementBuilder(route.out[port])
    left.connect({ left$: elem.out.left$ })
    right.connect({ right$: elem.out.right$ })
  }

  return { left, right }
}

export const hotPack = (format: string, ...inlets: Array<Connectable>) => {
  const coldConnections = inlets.slice(1)
  const bang = Bang(coldConnections)
  return Pack(format, [inlets[0], bang], ...coldConnections)
}

export const rotatingCounter = (length: number, inputs: Connectables) => {
  const counter = Int(inputs, 0)
  const addCounter = Mod(Add(counter, 1), length)
  counter.connect({ right: addCounter })
  return counter
}
