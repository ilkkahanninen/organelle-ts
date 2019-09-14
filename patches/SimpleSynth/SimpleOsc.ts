import {
  Multiply$,
  MidiToFreq,
  Select,
  Divide,
  Line$,
  Pack,
  Receive,
  Phasor,
  Cos$,
  Pow$,
  LPF,
  Osc,
  Add$
} from "@pd/objects"
import { createModule } from "@pd/module"
import { unpackNotes, Knob } from "@pd/organelle"

export const SimpleOsc = createModule(
  "SimpleOsc",
  <const>["notes"],
  <const>["out$"],
  ({ inlets, outlets }) => {
    //
    const { note, velocity } = unpackNotes(inlets.notes)

    // Knobs
    const attackTime = Receive("attack")
    const releaseTime = Receive("release")
    const glideTime = Receive("glide")
    const modulation = Receive("modulation")

    // Oscillator
    const freq = Line$(Pack("f f", MidiToFreq(note), glideTime))
    const phase = Pow$({
      base$: Phasor(freq),
      power$: Add$(Osc(modulation), 1.5)
    })
    const osc = Cos$(phase)

    // Velocity
    const noteOff = Select(velocity, 0)
    const oscVelocity = Line$([
      Pack("f f", Divide(noteOff.out.else, 127), attackTime), // Attack
      Pack("f f", noteOff.out.match, releaseTime) // Release
    ])

    const out = Multiply$({ left$: osc, right$: oscVelocity })

    outlets.out$.connect({ data: out })
  }
)
