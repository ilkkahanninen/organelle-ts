import { Multiply, Add, Int, Send } from "@pd/objects"
import { createMainModule } from "@pd/module"
import { OutLeft, OutRight, Knob, ScreenLine, MidiNotes } from "@pd/organelle"
import { msg } from "@pd/core"
import { SimpleOsc } from "patches/SimpleSynth/SimpleOsc"
import { polyphonic } from "@pd/helpers"

export const main = createMainModule(() => {
  // Knobs
  const attackTime = Add(Multiply(Knob(1), 3000), 10)
  const releaseTime = Add(Multiply(Knob(2), 5000), 10)
  const glideTime = Multiply(Knob(3), 1000)
  const modulation = Multiply(Knob(4), 20)

  // Globals
  Send(attackTime, "attack")
  Send(releaseTime, "release")
  Send(glideTime, "glide")
  Send(modulation, "modulation")

  // Polyphonic oscillator
  const synth = polyphonic(6, 1, MidiNotes(), SimpleOsc)

  // Audio out
  OutLeft(synth)
  OutRight(synth)

  // Screen
  ScreenLine(1, msg("Attack $1 ms", Int(attackTime)))
  ScreenLine(2, msg("Release $1 ms", Int(releaseTime)))
  ScreenLine(3, msg("Glide $1 ms", Int(glideTime)))
  ScreenLine(4, msg("Modulation $1 Hz", modulation))
})
