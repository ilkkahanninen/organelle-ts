import { objCreator, objCreator2, ConnectablesMap, Connectables } from "./core"

const variablePorts = <const>[
  "p0",
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "p7",
  "p8",
  "p9",
  "p10",
  "p11",
  "p12",
  "p13",
  "p14",
  "p15"
]

export type VariablePort = (typeof variablePorts)[number]

//----------------------------------------------------------------------------
// GENERAL
//----------------------------------------------------------------------------

/**
 * Output a bang message.
 */
export const Bang = objCreator("bang", <const>["trigger"], <const>["bang"])

/**
 * Store and recall a number
 */
export const Float = objCreator(
  "float",
  <const>["left", "right"],
  <const>["value"]
)

/**
 * Store and recall a symbol
 */
export const Symbol = objCreator(
  "symbol",
  <const>["left", "right"],
  <const>["symbol"]
)

/**
 * Store and recall an integer
 */
export const Int = objCreator(
  "int",
  <const>["left", "right"],
  <const>["symbol"]
)

/**
 * Send a message to a named object
 */
export const Send = objCreator("send", <const>["message", "name"], <const>[])

/**
 * Catch sent messages
 */
export const Receive = (name: string) =>
  objCreator("receive", <const>[], <const>["message"])(undefined, name)

/**
 * Test for matchin numbers or symbols
 */
export const Select = objCreator(
  "select",
  <const>["left", "right"],
  <const>["match", "else"]
)
export const Select2 = objCreator2(
  "select",
  <const>["value"],
  <const>["eq1", "eq2"]
)
// TODO: Lisää variantteja

export const Osc = objCreator("osc~", <const>["freq$", "phase$"], <const>["$"])
export const Phasor = objCreator(
  "phasor~",
  <const>["freq$", "phase$"],
  <const>["$"]
)
export const DAC = objCreator("dac~", <const>["left$", "right$"], <const>[])
export const Loadbang = objCreator("loadbang", <const>[], <const>[])
export const Multiply = objCreator("*", <const>["left", "right"], <const>["$"])
export const Multiply$ = objCreator(
  "*~",
  <const>["left$", "right$"],
  <const>["$"]
)
export const Divide = objCreator("/", <const>["left", "right"], <const>["$"])
export const Divide$ = objCreator(
  "/~",
  <const>["left$", "right$"],
  <const>["$"]
)
export const Add = objCreator("+", <const>["left", "right"], <const>["$"])
export const Add$ = objCreator("+~", <const>["left$", "right$"], <const>["$"])
export const Subtract = objCreator("-", <const>["left", "right"], <const>["$"])
export const Subtract$ = objCreator(
  "-~",
  <const>["left$", "right$"],
  <const>["$"]
)
export const LPF = objCreator(
  "lop~",
  <const>["signal$", "freq"],
  <const>["signal$"]
)
export const Throw$ = objCreator("throw~", <const>["data"], <const>[""])
export const Unpack = objCreator(
  "unpack",
  <const>["message"],
  <const>["v1", "v2"]
)
export const MidiToFreq = objCreator("mtof", <const>["note"], <const>["freq"])
export const Line$ = objCreator(
  "line~",
  <const>["message", "rampTime", "grain"],
  <const>["value"]
)

export const Pack = (format: string, ...inlets: Array<Connectables>) =>
  objCreator("pack", variablePorts, <const>["message"])(
    inlets.reduce(
      (obj, value, index) => ({ ...obj, [`p${index}`]: value }),
      {}
    ),
    format
  )

export const Poly = objCreator(
  "poly",
  <const>["polyphony", "noteStealing"],
  <const>["index", "note", "velocity"]
)

export const Route = objCreator("route", <const>["message"], variablePorts)

export const Cos$ = objCreator("cos~", <const>["in$"], <const>["$"])
export const Pow$ = objCreator("pow~", <const>["base$", "power$"], <const>["$"])
