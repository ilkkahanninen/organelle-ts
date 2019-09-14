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
  Add$,
  Divide$
} from "@pd/objects"
import { createModule } from "@pd/module"
import { unpackNotes, Knob } from "@pd/organelle"
import { times } from "@pd/utils"

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
    const oscs = times(5, index =>
      Cos$(
        Pow$({
          base$: Phasor(
            Multiply$(freq, 1 + index * 0.001 * (index % 2 === 0 ? 1 : -1))
          ),
          power$: Add$(Osc(modulation), 1.5)
        })
      )
    )

    const osc = Divide$(oscs, 5)

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
