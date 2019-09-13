import { objCreator } from "@pd/core";
import { Unpack } from "@pd/objects";

// Knobs
export const Knob1 = objCreator('r knob1', <const>[], <const>['value'])
export const Knob2 = objCreator('r knob2', <const>[], <const>['value'])
export const Knob3 = objCreator('r knob3', <const>[], <const>['value'])
export const Knob4 = objCreator('r knob4', <const>[], <const>['value'])
export const VolKnob = objCreator('r vol', <const>[], <const>['value'])
export const ExprPedal = objCreator('r exp', <const>[], <const>['value'])

// Buttons
export const AuxButton = objCreator('r aux', <const>[], <const>['isDown'])
export const MidiNotes = objCreator('r notes', <const>[], <const>['noteVelocity'])

// Audio I/O
export const InLeft = objCreator('r~ outL', <const>['audio'], <const>[])
export const InRight = objCreator('r~ outR', <const>['audio'], <const>[])
export const OutLeft = objCreator('throw~ outL', <const>['audio'], <const>[])
export const OutRight = objCreator('throw~ outR', <const>['audio'], <const>[])

// Utils
export const getMidiNotes = () => {
  const midi = Unpack(MidiNotes())
  return {
    note: midi.out.v1,
    velocity: midi.out.v2
  }
}