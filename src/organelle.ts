import { objCreator } from "@pd/core";

export const OutLeft = objCreator('throw~ outL', <const>['audio'], <const>[])
export const OutRight = objCreator('throw~ outR', <const>['audio'], <const>[])
export const Knob1 = objCreator('r knob1', <const>[], <const>['value'])
export const Knob2 = objCreator('r knob2', <const>[], <const>['value'])
export const Knob3 = objCreator('r knob3', <const>[], <const>['value'])
export const Knob4 = objCreator('r knob4', <const>[], <const>['value'])