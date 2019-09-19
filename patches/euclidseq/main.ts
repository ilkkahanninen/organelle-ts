import { createMainModule } from "@pd/module"
import { Clock } from "./Clock"
import { Parameters } from "./Parameters"
import { Sequencer } from "patches/euclidseq/Sequencer"
import { InLeft, InRight, OutLeft, OutRight } from "@pd/organelle"
import { Osc, Multiply$, Divide$, Random, Receive } from "@pd/objects"

export const main = createMainModule(() => {
  Parameters()
  Clock()
  Sequencer()

  const drySignal = InLeft()
  const wetSignal = InRight()

  // Fx route test with fixed ring modulator
  const freq = Random(Receive("accent"), 3000)
  const osc = Osc(freq)
  const fxOut = Multiply$({ left$: wetSignal, right$: osc })
  const mix = Divide$([drySignal, fxOut], 2)

  OutLeft(mix)
  OutRight(mix)
})
