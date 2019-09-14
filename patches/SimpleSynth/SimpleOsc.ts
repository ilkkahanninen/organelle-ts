import {
  Multiply$,
  MidiToFreq,
  Osc,
  Select,
  Divide,
  Line$,
  Pack,
  Receive
} from "@pd/objects"
import { createModule } from "@pd/module"

export const SimpleOsc = createModule(
  "SimpleOsc",
  <const>["note", "velocity"],
  <const>["out$"],
  ({ inlets, outlets }) => {
    // Knobs
    const attackTime = Receive("attack")
    const releaseTime = Receive("release")
    const glideTime = Receive("glide")

    // Oscillator
    const freq = Line$(Pack("f f", MidiToFreq(inlets.note), glideTime))
    const osc = Osc(freq)

    // Velocity
    const noteOff = Select(inlets.velocity, 0)
    const oscVelocity = Line$([
      Pack("f f", Divide(noteOff.out.else, 127), attackTime), // Attack
      Pack("f f", noteOff.out.match, releaseTime) // Release
    ])

    const out = Multiply$({ left$: osc, right$: oscVelocity })

    outlets.out$.connect({ data: out })
  }
)
