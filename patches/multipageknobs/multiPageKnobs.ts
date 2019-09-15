import {
  Int,
  Loadbang,
  Add,
  Bang,
  Select,
  Mod,
  Float,
  Send,
  Spigot,
  Equals,
  Delay
} from "@pd/objects"
import { ScreenLine, AuxButtonClick, Knob, LED } from "@pd/organelle"
import { msg, PdElement, PortMapping, firstPort } from "@pd/core"
import { times } from "@pd/utils"

export type MultiPageLine = {
  name: string
  render: string
  initialValue: number
  convert?: (value: PortMapping) => PdElement<any, any>
  toViewValue?: (value: PortMapping) => PdElement<any, any>
}

export type MultiPagePage = {
  name: string
  lines: MultiPageLine[]
}

export type MultiPagesOptions = {
  ledEnabled: boolean
}

const defaultOptions: MultiPagesOptions = {
  ledEnabled: true
}

export const createMultiPageKnobs = (
  pages: MultiPagePage[],
  options: MultiPagesOptions = defaultOptions
) => {
  // Controls
  const init = Loadbang()
  const delayedInit = Int(Delay(init, 200), 1)
  const auxClick = AuxButtonClick()
  const knobs = times(4, i => Knob(i + 1))

  // Page index selector
  const page = Int([init, auxClick], 0)
  const nextPage = Mod(Add(page, 1), pages.length)
  page.connect({ right: nextPage })

  // Setup pages
  pages.forEach(({ name, lines }, pageIndex) => {
    const thisPageIsSelected = Equals(page, pageIndex)
    const onPageSelect = Bang(Select(page, pageIndex))

    // Page title
    ScreenLine(1, msg(name, onPageSelect))

    times(4, lineIndex => {
      const line = lines[lineIndex]
      const knob = knobs[lineIndex]
      const screenLineIndex = lineIndex + 2

      if (line) {
        // Inputs
        const virtualKnob = Spigot({ value: knob, pass: thisPageIsSelected })
        const initialValue = msg(line.initialValue, delayedInit)

        // Convert knob range to desired range
        const convertedValue = line.convert
          ? line.convert(firstPort(virtualKnob))
          : virtualKnob
        Send([convertedValue, initialValue], line.name)

        // Output to screen
        const viewValue = Float([
          line.toViewValue
            ? line.toViewValue(firstPort(convertedValue))
            : convertedValue,
          line.toViewValue
            ? line.toViewValue(firstPort(initialValue))
            : initialValue,
          onPageSelect
        ])
        ScreenLine(
          screenLineIndex,
          msg(
            line.render,
            Spigot({ value: viewValue, pass: thisPageIsSelected })
          )
        )
      } else {
        ScreenLine(screenLineIndex, msg("·", thisPageIsSelected))
      }

      // LED light
      if (options.ledEnabled) {
        LED(pageIndex + 1, onPageSelect)
      }
    })
  })
}
