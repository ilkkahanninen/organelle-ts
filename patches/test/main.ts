import { msg } from "@pd/core";
import { Loadbang, DAC, Send, Throw$ } from "@pd/objects";
import { createMainModule } from "@pd/module";
import { DualOsc } from "./DualOsc";

export const main = createMainModule(() => {
  const loadbang = Loadbang()
  const f1 = msg(440, loadbang)
  const f2 = msg(441, loadbang)
  const osc = DualOsc({ freq1: f1, freq2: f2 })
  Throw$({ data: osc }, 'outL')
  Throw$({ data: osc }, 'outR')
})
