import { createModule } from "@pd/module"
import { createMultiPageKnobs } from "../multipageknobs/MultiPageKnobs"
import { Add, Multiply, Int, Pow, Subtract } from "@pd/objects"

export const Parameters = createModule("Parameters", [], [], () =>
  createMultiPageKnobs([
    {
      name: "ENVELOPE",
      lines: [
        {
          name: "attack",
          render: "Attack $1 ms",
          initialValue: 100,
          convert: value => Add(Multiply(value, 3000), 3),
          toViewValue: Int
        },
        {
          name: "release",
          render: "Release $1 ms",
          initialValue: 1000,
          convert: value => Add(Multiply(value, 5000), 3),
          toViewValue: Int
        },
        {
          name: "glide",
          render: "Glide $1 ms",
          initialValue: 25,
          convert: value => Multiply(value, 300),
          toViewValue: Int
        }
      ]
    },
    {
      name: "OSCILLATOR",
      lines: [
        {
          name: "oscPhaseShape",
          render: "Softness $1%",
          initialValue: 0.5,
          convert: value => Add(value, 0.05),
          toViewValue: value => Int(Subtract(Multiply(value, 100), 0.5))
        },
        {
          name: "oscPhaseModFreq",
          render: "Mod. freq $1 Hz",
          initialValue: 0.5,
          convert: value => Multiply(Pow(value, 2), 20)
        },
        {
          name: "oscPhaseModAmount",
          render: "Mod. amount $1%",
          initialValue: 0.1,
          toViewValue: value => Int(Multiply(value, 100))
        },
        {
          name: "oscDetune",
          render: "Detune $1%",
          initialValue: 0.001,
          convert: value => Multiply(value, 0.01),
          toViewValue: value => Int(Multiply(value, 10000))
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
