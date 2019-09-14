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
  Osc,
  Add$,
  Divide$,
  Loadbang,
  Random
} from "@pd/objects"
import { createModule } from "@pd/module"
import { unpackNotes, Knob } from "@pd/organelle"
import { times } from "@pd/utils"

export const SimpleOsc = createModule(
  "SimpleOsc",
  <const>["notes"],
  <const>["left$", "right$"],
  ({ inlets, outlets }) => {
    const { note, velocity } = unpackNotes(inlets.notes)
    const initialPhase = Random(Loadbang())

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
          base$: Phasor({
            freq$: Multiply$(
              freq,
              1 + index * 0.001 * (index % 2 === 0 ? 1 : -1)
            ),
            phase$: initialPhase
          }),
          power$: Add$(Osc(modulation), 1.5)
        })
      )
    )

    const leftOscs = oscs.map((osc, index) =>
      Multiply$(osc, 0.2 * (0.8 - index / 5))
    )
    const rightOscs = oscs.map((osc, index) =>
      Multiply$(osc, (0.2 * index) / 5)
    )

    // Velocity
    const noteOff = Select(velocity, 0)
    const oscVelocity = Line$([
      Pack("f f", Divide(noteOff.out.else, 127), attackTime), // Attack
      Pack("f f", noteOff.out.match, releaseTime) // Release
    ])

    const leftOut = Multiply$({ left$: leftOscs, right$: oscVelocity })
    const rightOut = Multiply$({ left$: rightOscs, right$: oscVelocity })

    outlets.left$.connect({ data: leftOut })
    outlets.right$.connect({ data: rightOut })
  }
)
