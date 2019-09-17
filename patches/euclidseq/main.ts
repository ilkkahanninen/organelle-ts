import { createMainModule } from "@pd/module"
import { Parameters } from "./Parameters"
import { Track } from "./Track"
import { Receive, Loadbang } from "@pd/objects"
import { msg } from "@pd/core"
import { drumSynths, midiChannel } from "patches/euclidseq/config"
import { MidiTrack } from "patches/euclidseq/MidiTrack"
import { Clock } from "patches/euclidseq/Clock"

export const main = createMainModule(() => {
  Parameters()
  Clock()

  const init = Loadbang()
  const midiCh = msg(midiChannel, init)

  const accent = Track({
    fill: Receive("fillAccent"),
    offset: Receive("fillOffset")
  })
  const accentVelocity = msg(120, accent.out.hit)
  const normalVelocity = msg(60, accent.out.rest)
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
})
