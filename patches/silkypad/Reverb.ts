import { createModule } from "@pd/module"
import { Reverb3, Receive, Add$, Multiply$, Print, LPF } from "@pd/objects"

export const Reverb = createModule(
  "Reverb",
  <const>["left$", "right$"],
  <const>["left$", "right$"],
  ({ inlets, outlets }) => {
    const reverb = Reverb3(
      {
        left$: inlets.left$,
        right$: inlets.right$,
        liveness: Receive("verbLiveness"),
        crossoverFreq: Receive("verbCrossover"),
        hfDamping: Receive("verbHfDamp")
      },
      100
    )

    const wetAmount$ = LPF(Receive("verbDryWet"), 10)
    const dryAmount$ = Add$(Multiply$(wetAmount$, -1), 1)

    const outL$ = Add$({
      left$: Multiply$({ left$: inlets.left$, right$: dryAmount$ }),
      right$: Multiply$({ left$: reverb.out.left$, right$: wetAmount$ })
    })

    const outR$ = Add$({
      left$: Multiply$({ left$: inlets.right$, right$: dryAmount$ }),
      right$: Multiply$({ left$: reverb.out.right$, right$: wetAmount$ })
    })

    outlets.left$.connect({ data: outL$ })
    outlets.right$.connect({ data: outR$ })
  }
)
