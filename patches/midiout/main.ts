import { createMainModule } from "@pd/module"
import {
  OutLeft,
  OutRight,
  InLeft,
  InRight,
  MidiNotes,
  unpackNotes
} from "@pd/organelle"
import { Parameters } from "patches/silkypad/Parameters"
import { Reverb } from "patches/silkypad/Reverb"
import { MidiOut, Receive } from "@pd/objects"

export const main = createMainModule(() => {
  Parameters()

  // MIDI thru
  MidiOut({
    ...unpackNotes(MidiNotes()),
    channel: Receive("midiChannel")
  })

  // Reverb
  const reverb = Reverb({
    left$: InLeft(),
    right$: InRight()
  })

  // Audio out
  OutLeft(reverb.out.left$)
  OutRight(reverb.out.right$)
})
