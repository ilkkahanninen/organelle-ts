import { objCreator, objCreator2, Connectables, Connectable } from "./core"

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

export const Spigot = objCreator(
  "spigot",
  <const>["value", "pass"],
  <const>["value"]
)

export const Equals = objCreator(
  "==",
  <const>["left", "right"],
  <const>["result"]
)
export const LessThan = objCreator(
  "<",
  <const>["left", "right"],
  <const>["result"]
)
export const GreaterThan = objCreator(
  ">",
  <const>["left", "right"],
  <const>["result"]
)
export const Or = objCreator("||", <const>["left", "right"], <const>["result"])

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
export const Throw$ = objCreator("throw~", <const>["data"], <const>[])
export const Unpack = objCreator(
  "unpack",
  <const>["message"],
  <const>["v1", "v2"]
)
export const MidiToFreq = objCreator("mtof", <const>["note"], <const>["freq"])
export const MakeNote = objCreator(
  "makenote",
  <const>["note", "velocity", "duration"],
  <const>["note", "velocity"]
)
export const MidiOut = objCreator(
  "noteout",
  <const>["note", "velocity", "channel"],
  <const>[]
)
export const Line$ = objCreator(
  "line~",
  <const>["message", "rampTime", "grain"],
  <const>["value"]
)

export const Trigger = (format: string, input: Connectables) =>
  objCreator("t", <const>["value"], variablePorts)(input, format)

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
export const Pow = objCreator("pow", <const>["base", "power"], <const>["value"])
export const Pow$ = objCreator("pow~", <const>["base$", "power$"], <const>["$"])
export const Random = objCreator("random", <const>["n"], <const>["value"])
export const Mod = objCreator(
  "mod",
  <const>["dividend", "divisor"],
  <const>["value"]
)

export const Reverb3 = objCreator(
  "rev3~",
  <const>[
    "left$",
    "right$",
    "levelDb",
    "liveness",
    "crossoverFreq",
    "hfDamping"
  ],
  <const>["left$", "right$", "out3$", "out4$"]
)

export const Print = objCreator("print", <const>["message"], <const>[])

export const Delay = objCreator(
  "delay",
  <const>["message", "delay"],
  <const>["message"]
)

export const Metronome = objCreator(
  "metro",
  <const>["message", "rate"],
  <const>["tick"]
)

export const Noise$ = objCreator("noise~", <const>[], <const>["out$"])
export const Sin = objCreator("sin", <const>["in"], <const>["out"])
