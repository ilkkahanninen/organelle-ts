import { createModule } from "./src/core";
import { Osc } from "./src/objects";

const mod = createModule(
  <const>["freq1", "freq2"],
  <const>["$"],
  ({ inlets, outlets }) => {

    const osc1 = Osc({ freq: inlets.freq1 })
    const osc2 = Osc({ freq: inlets.freq2 })

    outlets.$.connect({ data: [osc1, osc2] })
  }
)

console.log(mod.toString())
