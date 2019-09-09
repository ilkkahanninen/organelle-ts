import { objCreator, objCreator2 } from "./core"

//----------------------------------------------------------------------------
// GENERAL
//----------------------------------------------------------------------------

/**
 * Output a bang message.
 */
export const Bang = objCreator('bang', <const>['trigger'], <const>['bang'])

/**
 * Store and recall a number
 */
export const Float = objCreator('float', <const>['left', 'right'], <const>['value'])

/**
 * Store and recall a symbol
 */
export const Symbol = objCreator('symbol', <const>['left', 'right'], <const>['symbol'])

/**
 * Store and recall an integer
 */
export const Int = objCreator('int', <const>['left', 'right'], <const>['symbol'])

/**
 * Send a message to a named object
 */
export const Send = objCreator('send', <const>['message', 'name'], <const>[])

/**
 * Catch sent messages
 */
export const Receive = objCreator('receive', <const>[], <const>['message'])

/**
 * Test for matchin numbers or symbols
 */
export const Select = objCreator('select', <const>['left', 'right'], <const>['equals', 'else'])
export const Select2 = objCreator2('select', <const>['value'], <const>['eq1', 'eq2'])
// TODO: Lisää variantteja


export const Osc$ = objCreator('osc~', <const>['freq'], <const>['stream'])
export const DAC$ = objCreator('dac~', <const>['left', 'right'], <const>[])
export const Loadbang = objCreator('loadbang', <const>[], <const>[])
export const Multiply$ = objCreator('*~', <const>['left', 'right'], <const>['stream'])
