import { msg } from "@pd/core";
import { Loadbang, DAC } from "@pd/objects";
import { createMainModule } from "@pd/module";
import { DualOsc } from "./dualosc";

export const Main = createMainModule(() => {
  const loadbang = Loadbang()
  const f1 = msg(440, loadbang)
  const f2 = msg(220, loadbang)
  const osc = DualOsc({ freq1: f1, freq2: f2 })
  DAC({ left$: osc, right$: osc })
})
