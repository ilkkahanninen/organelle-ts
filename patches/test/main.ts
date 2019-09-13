import { msg } from "@pd/core";
import { Loadbang, DAC, Send, Throw$, Multiply$, Multiply, LPF } from "@pd/objects";
import { createMainModule } from "@pd/module";
import { DualOsc } from "./DualOsc";
import { Knob1, Knob2, OutLeft, OutRight } from "@pd/organelle";

export const main = createMainModule(() => {
  const f1 = LPF(Multiply(Knob1(), 5000), 10)
  const f2 = LPF(Multiply(Knob2(), 5000), 10)

  const osc = Multiply$(DualOsc({ freq1$: f1, freq2$: f2 }), 0.5)

  OutLeft(osc)
  OutRight(osc)
})
