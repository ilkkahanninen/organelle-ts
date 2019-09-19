import { createModule } from "@pd/module"
import { createMultiPageKnobs } from "../multipageknobs/MultiPageKnobs"
import { Add, Multiply, Int, Pow, Subtract, Multiply$ } from "@pd/objects"

export const Parameters = createModule("Parameters", [], [], () =>
  createMultiPageKnobs([
    {
      name: "MIDI",
      lines: [
        {
          name: "midiChannel",
          render: "Midi channel $1",
          initialValue: 0,
          convert: value => Int(Multiply(value, 15))
        }
      ]
    },
    {
      name: "REVERB",
      lines: [
        {
          name: "verbDryWet",
          render: "Dry/Wet $1%",
          initialValue: 0.2,
          toViewValue: value => Int(Multiply(value, 100))
        },
        {
          name: "verbLiveness",
          render: "Length $1%",
          initialValue: 95,
          convert: value => Add(Multiply(value, 20), 80), // Scale 0..1 -> 80..100
          toViewValue: value => Int(Multiply(Subtract(value, 80), 5)) // Scale 80..100 -> 0..100
        },
        {
          name: "verbCrossover",
          render: "Crossover $1 Hz",
          initialValue: 1040,
          convert: value => Multiply(value, 8000),
          toViewValue: Int
        },
        {
          name: "verbHfDamp",
          render: "HF Damping $1%",
          initialValue: 20,
          convert: value => Multiply(value, 100),
          toViewValue: Int
        }
      ]
    }
  ])
)
