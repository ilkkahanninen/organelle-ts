import { createModule } from "@pd/module"
import { Add, Multiply, Mod, LessThan, Select } from "@pd/objects"

export const Euclid = createModule(
  "Euclid",
  <const>["tick", "fill", "offset", "length"],
  <const>["hit", "rest"],
  ({ inlets, outlets }) => {
    const select = Select(
      LessThan({
        left: Mod({
          dividend: Multiply({
            left: Add({ left: inlets.tick, right: inlets.offset }),
            right: inlets.fill
          }),
          divisor: inlets.length
        }),
        right: inlets.fill
      }),
      1
    )
    outlets.hit.connect({ data: select.out.match })
    outlets.rest.connect({ data: select.out.else })
  }
)
