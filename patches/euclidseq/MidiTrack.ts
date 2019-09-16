import { createModule } from "@pd/module"
import { MakeNote, Loadbang, MidiOut, Int } from "@pd/objects"
import { msg } from "@pd/core"
import { Track } from "./Track"

export const MidiTrack = createModule(
  "MidiTrack",
  <const>["fill", "offset", "midiCh", "note", "velocity"],
  <const>[],
  ({ inlets }) => {
    const hit = Track({
      fill: inlets.fill,
      offset: inlets.offset
    })
    const note = MakeNote({
      note: Int({ left: hit, right: inlets.note }),
      velocity: Int({ left: hit, right: inlets.velocity }),
      duration: msg(10, Loadbang())
    })
    MidiOut({
      note: note.out.note,
      velocity: note.out.velocity,
      channel: inlets.midiCh
    })
  }
)
