import { Multiply, Add, Int, Send, Pow, Reverb3 } from "@pd/objects"
import { createMainModule } from "@pd/module"
import { OutLeft, OutRight, Knob, ScreenLine, MidiNotes } from "@pd/organelle"
import { msg } from "@pd/core"
import { polyphonic, polyphonicStereo } from "@pd/helpers"
import { SimpleOsc } from "./SimpleOsc"

export const main = createMainModule(() => {
  // Knobs
  const attackTime = Add(Multiply(Knob(1), 3000), 3)
  const releaseTime = Add(Multiply(Knob(2), 5000), 3)
  const glideTime = Multiply(Knob(3), 300)
  const modulation = Multiply(Pow(Knob(4), 2), 20)

  // Globals
  Send(attackTime, "attack")
  Send(releaseTime, "release")
  Send(glideTime, "glide")
  Send(modulation, "modulation")

  // Polyphonic oscillator
  const synth = polyphonicStereo(6, 1, MidiNotes(), SimpleOsc)

  // Reverb
  const reverb = Reverb3(
    { left$: synth.left, right$: synth.right },
    "100 90 3000 20"
  )

  // Audio out
  OutLeft(reverb.out.left$)
  OutRight(reverb.out.right$)

  // Screen
  ScreenLine(1, msg("Attack $1 ms", Int(attackTime)))
  ScreenLine(2, msg("Release $1 ms", Int(releaseTime)))
  ScreenLine(3, msg("Glide $1 ms", Int(glideTime)))
  ScreenLine(4, msg("Modulation $1 Hz", modulation))
})
