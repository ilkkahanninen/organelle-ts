import { createModule } from "@pd/module"
import { Trigger, Multiply, Receive } from "@pd/objects"
import { Euclid } from "./Euclid"

export const Track = createModule(
  "Track",
  <const>["fill", "offset"],
  <const>["hit", "rest"],
  ({ inlets, outlets }) => {
    const length = Receive("barLength")
    const tick = Receive("tick")

    const lengthTrigger = Trigger("b f", length)

    const euclid = Euclid({
      tick: tick,
      fill: Multiply({
        left: [inlets.fill, lengthTrigger.out.p0],
        right: lengthTrigger.out.p1
      }),
      offset: inlets.offset,
      length: length
    })

    outlets.hit.connect({ data: euclid.out.hit })
    outlets.rest.connect({ data: euclid.out.rest })
  }
)
