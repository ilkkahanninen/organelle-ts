import { createModule, createMainModule, msg } from "./src/core";
import { Osc, Loadbang, DAC } from "./src/objects";

const DualOsc = createModule(
  "dualosc",
  <const>["freq1", "freq2"],
  <const>["$"],
  ({ inlets, outlets }) => {

    const osc1 = Osc({ freq: inlets.freq1 })
    const osc2 = Osc({ freq: inlets.freq2 })

    outlets.$.connect({ data: [osc1, osc2] })
  }
)

const Main = createMainModule(() => {
  const loadbang = Loadbang()
  const f1 = msg(440, loadbang)
  const f2 = msg(220, loadbang)
  const osc = DualOsc({ freq1: f1, freq2: f2 })
  DAC({ left$: osc, right$: osc })
})

console.log("dualosc.pd:")
console.log(DualOsc.toString())

console.log("\nmain.pd:")
console.log(Main.toString())
