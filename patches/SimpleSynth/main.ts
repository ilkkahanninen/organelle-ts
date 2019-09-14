import { Multiply, Add, Int, Send } from "@pd/objects"
import { createMainModule } from "@pd/module"
import {
  OutLeft,
  OutRight,
  getMidiNotes,
  Knob,
  ScreenLine
} from "@pd/organelle"
import { msg } from "@pd/core"
import { SimpleOsc } from "patches/SimpleSynth/SimpleOsc"

export const main = createMainModule(() => {
  const { note, velocity } = getMidiNotes()

  // Knobs
  const attackTime = Add(Multiply(Knob(1), 3000), 10)
  const releaseTime = Add(Multiply(Knob(2), 5000), 10)
  const glideTime = Multiply(Knob(3), 1000)

  // Globals
  Send(attackTime, "attack")
  Send(releaseTime, "release")
  Send(glideTime, "glide")

  // Oscillator
  const osc = SimpleOsc({ note, velocity })

  // Audio out
  OutLeft(osc.out.out$)
  OutRight(osc.out.out$)

  // Screen
  ScreenLine(1, msg("Attack $1 ms", Int(attackTime)))
  ScreenLine(2, msg("Release $1 ms", Int(releaseTime)))
  ScreenLine(3, msg("Glide $1 ms", Int(glideTime)))
})
