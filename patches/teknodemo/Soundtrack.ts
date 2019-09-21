import { createModule } from "@pd/module"
import {
  Loadbang,
  Metronome,
  Print,
  Phasor,
  Multiply$,
  Osc,
  Add$,
  Pow$,
  Mod,
  Int,
  Add,
  Select,
  Noise$,
  Delay,
  Multiply,
  Sin,
  Reverb3
} from "@pd/objects"
import { msg } from "@pd/core"
import { OutLeft, OutRight } from "@pd/organelle"

export const Soundtrack = createModule("Soundtrack", [], [], () => {
  const init = Loadbang()
  const metro = Metronome([msg("tempo 100 msec", init), msg(1, init)])
  const counter = Int(metro, 0)
  const addCounter = Mod(Add(counter, 1), 8)
  counter.connect({ right: addCounter })

  // Kick
  const freq = Add$(
    Multiply$(
      Pow$(
        Phasor({ phase$: msg(0, [Select(counter, 0), Select(counter, 4)]) }, 1),
        0.1
      ),
      -250
    ),
    280
  )
  const kick = Osc(freq)

  // Hihat
  const hihatVelo = [msg(0.1, metro), msg(0, Delay(metro, 1))]
  const hihat = Multiply$({ left$: Noise$(), right$: hihatVelo })
  const hihatVerb = Reverb3(hihat, "100 70 100 10")

  // Perc
  const perc = Multiply$({
    left$: Osc(Multiply(Sin(counter), 3000)),
    right$: Osc(Phasor({}, 2000))
  })
  const percVerb = Reverb3(perc, "60 100 100 50")

  // Perc 2
  const perc2 = Multiply$({
    left$: Osc(Multiply(Sin(Multiply(counter, 2)), 500)),
    right$: Osc(Phasor({}, 1200))
  })
  const percVerb2 = Reverb3(perc2, "60 100 100 50")

  // Out
  const mix = Add$([
    kick,
    Multiply$(hihat, 0.33),
    hihatVerb,
    percVerb,
    percVerb2
  ])
  OutLeft(mix)
  OutRight(mix)
})
