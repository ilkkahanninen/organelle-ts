import { Multiply$, Multiply, MidiToFreq, Osc } from "@pd/objects";
import { createMainModule } from "@pd/module";
import { OutLeft, OutRight, getMidiNotes } from "@pd/organelle";

export const main = createMainModule(() => {
  const { note, velocity } = getMidiNotes()
  const osc = Osc(MidiToFreq(note))
  const synth = Multiply$({ left$: osc, right$: Multiply(velocity, 0.01) })

  OutLeft(synth)
  OutRight(synth)
})
