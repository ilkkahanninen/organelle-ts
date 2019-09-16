import { createModule } from "@pd/module"
import {
  Loadbang,
  Int,
  Mod,
  Add,
  Receive,
  Divide,
  Send,
  Metronome,
  Delay,
  Unpack,
  GreaterThan,
  Select,
  Bang
} from "@pd/objects"
import { MidiNotes, LED } from "@pd/organelle"
import { msg } from "@pd/core"

export const Clock = createModule("Clock", [], [], () => {
  const init = Loadbang()

  // Play state
  const btnClick = Bang(Select(GreaterThan(Unpack(MidiNotes()).out.v2, 0), 1))
  const play = Int([init, btnClick], 0)
  const togglePlay = Mod(Add(play, 1), 2)
  play.connect({ right: togglePlay })

  // Metronome
  const tempo = Divide(msg("60000 $1", Receive("ticksPerMinute")))
  const metro = Metronome([play, msg("tempo $1 msec", tempo)])

  // Tick counter
  const counter = Int(metro)
  const increaseCounter = Add(counter, 1)
  counter.connect({ right: increaseCounter })

  // Send state out
  Send(tempo, "tempo")
  Send(increaseCounter, "tick")

  // Blink led
  LED(1, increaseCounter)
  LED(0, Delay(increaseCounter, 10))
})
