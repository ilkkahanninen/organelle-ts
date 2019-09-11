import { createModule } from "@pd/core";
import { Osc } from "@pd/objects";

export const DualOsc = createModule(
  "dualosc",
  <const>["freq1", "freq2"],
  <const>["$"],
  ({ inlets, outlets }) => {

    const osc1 = Osc({ freq: inlets.freq1 })
    const osc2 = Osc({ freq: inlets.freq2 })

    outlets.$.connect({ data: [osc1, osc2] })
  }
)