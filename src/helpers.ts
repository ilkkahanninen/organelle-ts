import { Poly, Pack, Route, VariablePort, Add, Add$ } from "@pd/objects"
import { Connectables, PdElement, PortMapping } from "@pd/core"

export const polyphonic = (
  polyphony: number,
  voiceStealing: number,
  input: Connectables,
  elementBuilder: (notes: PortMapping) => PdElement<any, any>
) => {
  const poly = Poly(input, `${polyphony} ${voiceStealing}`)
  const route = Route(
    Pack("0 0 0", poly.out.index, poly.out.note, poly.out.velocity),
    Array(polyphony)
      .fill(0)
      .map((_, i) => i + 1)
      .join(" ")
  )
  const mix = Add$()

  for (let i = 0; i < polyphony; i++) {
    const port = `p${i}` as VariablePort
    const elem = elementBuilder(route.out[port])
    mix.connect({ left$: elem })
  }

  return mix
}
