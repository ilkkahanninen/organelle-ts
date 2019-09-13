import { Multiply$, Multiply, MidiToFreq, Osc, Select, Divide, Line$ } from "@pd/objects";
import { createMainModule } from "@pd/module";
import { OutLeft, OutRight, getMidiNotes } from "@pd/organelle";
import { msg } from "@pd/core";

export const main = createMainModule(() => {
  const { note, velocity } = getMidiNotes()

  // Oscillator
  const osc = Osc(MidiToFreq(note))

  // Attentuator
  const noteOnOff = Select(velocity, 0)

  const oscVelocity = Line$([
    msg("0 10", noteOnOff.out.match),
    msg("$1 10", Divide(noteOnOff.out.else, 127))
  ])

  const out = Multiply$({ left$: osc, right$: oscVelocity })

  OutLeft(out)
  OutRight(out)
})
