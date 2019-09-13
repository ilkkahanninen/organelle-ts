import { msg } from "@pd/core";
import { Loadbang, DAC, Send, Throw$, Multiply$, Multiply, LPF } from "@pd/objects";
import { createMainModule } from "@pd/module";
import { DualOsc } from "./DualOsc";
import { Knob1, Knob2 } from "@pd/organelle";

export const main = createMainModule(() => {
  const f1 = LPF({ signal$: Multiply({ left: Knob1() }, 5000) }, 10)
  const f2 = LPF({ signal$: Multiply({ left: Knob2() }, 5000) }, 10)

  const osc = Multiply$({ left$: DualOsc({ freq1$: f1, freq2$: f2 }) }, 0.5)

  Throw$({ data: osc }, 'outL')
  Throw$({ data: osc }, 'outR')
})
