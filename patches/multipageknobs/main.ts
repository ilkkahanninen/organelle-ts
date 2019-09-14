import { createMainModule } from "@pd/module"
import { Int, Multiply, Print, Receive } from "@pd/objects"
import { createMultiPageKnobs } from "patches/multipageknobs/MultiPageKnobs"

export const main = createMainModule(() => {
  createMultiPageKnobs([
    {
      name: "ENVELOPE",
      lines: [
        {
          name: "attack",
          render: "o Attack $1 ms",
          convert: value => Multiply(value, 1000),
          toViewValue: Int
        },
        {
          name: "release",
          render: "o Release $1 ms",
          convert: value => Multiply(value, 2000),
          toViewValue: Int
        }
      ]
    },
    {
      name: "OSCILLATOR",
      lines: [
        {
          name: "saw",
          render: "o Saw $1%",
          convert: value => Multiply(value, 100),
          toViewValue: Int
        },
        {
          name: "square",
          render: "o Square $1%",
          convert: value => Multiply(value, 100),
          toViewValue: Int
        },
        {
          name: "triangle",
          render: "o Triangle $1%",
          convert: value => Multiply(value, 100),
          toViewValue: Int
        }
      ]
    }
  ])

  Print(Receive("attack"), "attack")
})
