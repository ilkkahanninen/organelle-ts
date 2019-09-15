import { objCreator, Connectables, PdElement, msg } from "@pd/core"
import { Unpack, Bang, Select } from "@pd/objects"

// Knobs
export const Knob = (n: number) =>
  objCreator(`r knob${n}`, <const>[], <const>["value"])()
export const VolKnob = objCreator("r vol", <const>[], <const>["value"])
export const ExprPedal = objCreator("r exp", <const>[], <const>["value"])

// Buttons
export const AuxButton = objCreator("r aux", <const>[], <const>["isDown"])
export const MidiNotes = objCreator(
  "r notes",
  <const>[],
  <const>["noteVelocity"]
)

// Audio I/O
export const InLeft = objCreator("r~ outL", <const>[], <const>["audio"])
export const InRight = objCreator("r~ outR", <const>[], <const>["audio"])
export const OutLeft = objCreator("throw~ outL", <const>["audio"], <const>[])
export const OutRight = objCreator("throw~ outR", <const>["audio"], <const>[])

// Screen
export const ScreenLine = (n: number, input?: Connectables) =>
  objCreator(`s screenLine${n}`, <const>["text"], <const>[])(input)
export const LED = (color: number, input: Connectables) =>
  objCreator("s led", <const>["color"], <const>[])(msg(color, input))

// Utils
export const unpackNotes = (input: PdElement<any, any>) => {
  const midi = Unpack(input)
  return {
    note: midi.out.v1,
    velocity: midi.out.v2
  }
}

export const AuxButtonClick = () => Bang(Select(AuxButton(), 1))
