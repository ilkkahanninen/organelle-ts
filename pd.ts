const fs = require("fs")
import { createModule, msg } from "./src/core";
import { Loadbang, Osc$, Multiply$, DAC$, Bang, Select2 } from "./src/objects";

const _ = createModule()
const loadbang = _(Loadbang())
const $ = (n: string | number) => _(msg(n, loadbang))

const osc1 = _(Osc$({ freq: $(440) }))
const osc2 = _(Osc$({ freq: $(220) }))
const mult = _(Multiply$({ left: osc1, right: osc2 }))
const out = _(DAC$({ left: mult, right: mult }))

const banger = _.controlIn()
_.streamIn()
_.controlOut()
_.streamOut()

_(Bang({ trigger: banger }))
_(Select2({}, [10, 20]))

const output = _.toString()
console.log(output)
fs.writeFileSync("lolwut.pd", output)
