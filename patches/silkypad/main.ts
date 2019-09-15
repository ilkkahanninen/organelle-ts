import { Reverb3, Receive } from "@pd/objects"
import { createMainModule } from "@pd/module"
import { OutLeft, OutRight, Knob, ScreenLine, MidiNotes } from "@pd/organelle"
import { polyphonicStereo } from "@pd/helpers"
import { SimpleOsc } from "./SimpleOsc"
import { Parameters } from "patches/silkypad/Parameters"
import { Reverb } from "patches/silkypad/Reverb"

export const main = createMainModule(() => {
  Parameters()

  // Polyphonic oscillator
  const synth = polyphonicStereo(6, 1, MidiNotes(), SimpleOsc)

  // Reverb
  const reverb = Reverb({
    left$: synth.left,
    right$: synth.right
  })

  // Audio out
  OutLeft(reverb.out.left$)
  OutRight(reverb.out.right$)
})
