import { createModule } from "@pd/module"
import { GraphicsEnabled, ScreenLine } from "@pd/organelle"
import {
  Metronome,
  Trigger,
  Send,
  Float,
  Loadbang,
  Add,
  Multiply,
  Sin,
  Random,
  Pack,
  Print,
  Int,
  Mod,
  Select,
  Spigot,
  Equals,
  Or
} from "@pd/objects"
import { msg } from "@pd/core"
import { times } from "@pd/utils"
import { rotatingCounter } from "@pd/helpers"

export const Visuals = createModule("Visuals", [], [], () => {
  const init = Loadbang()
  const metro = Metronome(Float(init, 1), 100)
  const trigger = Trigger("b b b", metro)

  const counter = rotatingCounter(8, metro)

  const hideInfobar = msg("/oled/gShowInfoBar 3 0", init)

  const clearScreen = msg("/oled/gClear 3 1", Select(counter, 0))
  // Näyttö on varmaankin 128x64????
  const trig = trigger.out.p1
  const lines = times(5, i => {
    const x1 = Random(trig, 128)
    const y1 = Random(trig, 64)
    const x2 = Random(trig, 128)
    const y2 = Random(trig, 64)
    return msg(`/oled/gLine 3 $1 $2 $3 $4 1`, Pack("f f f f", x1, y1, x2, y2))
  })
  const flip = msg(
    "/oled/gFlip 3",
    Spigot({
      value: trigger.out.p0,
      pass: Select(Random(trigger.out.p0, 2), 0)
    })
  )

  Send([hideInfobar, clearScreen, ...lines, flip], "oscOut")
  ScreenLine(5, msg("JML – PURE CLASSICS", trigger.out.p0))
})
