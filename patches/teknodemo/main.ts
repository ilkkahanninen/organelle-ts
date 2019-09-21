import { createMainModule } from "@pd/module"
import { Soundtrack } from "patches/teknodemo/Soundtrack"
import { Visuals } from "patches/teknodemo/Visuals"

export const main = createMainModule(() => {
  Soundtrack()
  Visuals()
})
