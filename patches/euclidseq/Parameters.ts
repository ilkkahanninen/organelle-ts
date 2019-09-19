import { createModule } from "@pd/module"
import { Add, Multiply, Int } from "@pd/objects"
import {
  createMultiPageKnobs,
  MultiPagePage
} from "../multipageknobs/MultiPageKnobs"
import { drumSynths } from "patches/euclidseq/config"

const drumParameters = (index: number, name: string): MultiPagePage => ({
  name: `(${index + 1}) ${name}`,
  lines: [
    {
      name: `fill${index}`,
      render: "Fill $1%",
      initialValue: 0,
      toViewValue: value => Int(Multiply(value, 100))
    },
    {
      name: `offset${index}`,
      render: "Offset $1%",
      initialValue: 0,
      toViewValue: value => Int(Multiply(value, 100))
    }
  ]
})

export const Parameters = createModule("Parameters", [], [], () =>
  createMultiPageKnobs(
    [
      {
        name: "(*) GLOBAL",
        lines: [
          {
            name: "barLength",
            render: "Bar length $1",
            initialValue: 8,
            convert: value => Int(Add(Multiply(value, 32), 1))
          },
          {
            name: "ticksPerMinute",
            render: "Ticks/min $1",
            initialValue: 120,
            convert: value => Add(Multiply(value, 500), 1),
            toViewValue: Int
          },
          {
            name: "fillAccent",
            render: "Accent fill $1%",
            initialValue: 0,
            toViewValue: value => Int(Multiply(value, 100))
          },
          {
            name: "offsetAccent",
            render: "Accent offset $1%",
            initialValue: 0,
            toViewValue: value => Int(Multiply(value, 100))
          }
        ]
      },
      ...drumSynths.map((synth, index) => drumParameters(index, synth.name))
    ],
    {
      ledEnabled: false
    }
  )
)
