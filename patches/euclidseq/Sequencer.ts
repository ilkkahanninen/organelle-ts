import { createModule } from "@pd/module"
import { Loadbang, Receive, Send, Bang } from "@pd/objects"
import { msg } from "@pd/core"
import { midiChannel, drumSynths } from "patches/euclidseq/config"
import { Track } from "patches/euclidseq/Track"
import { MidiTrack } from "patches/euclidseq/MidiTrack"

export const Sequencer = createModule("Sequencer", [], [], () => {
  const init = Loadbang()

  const midiCh = msg(midiChannel, init)

  const accent = Track({
    fill: Receive("fillAccent"),
    offset: Receive("fillOffset")
  })
  const accentVelocity = msg(120, accent.out.hit)
  const normalVelocity = msg(100, accent.out.rest)
  const velocity = [accentVelocity, normalVelocity]

  drumSynths.map((drum, index) =>
    MidiTrack({
      fill: Receive(`fill${index}`),
      offset: Receive(`offset${index}`),
      velocity,
      note: msg(drum.note, init),
      midiCh
    })
  )

  Send(Bang(accentVelocity), "accent")
})
