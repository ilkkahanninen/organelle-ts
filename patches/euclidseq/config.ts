export type DrumSynth = {
  name: string
  note: number
}

export const midiChannel = 10

export const drumSynths: DrumSynth[] = [
  { name: "KICK", note: 36 },
  { name: "DRUM 1", note: 48 },
  { name: "DRUM 2", note: 41 },
  { name: "MULTI", note: 58 },
  { name: "SNARE", note: 40 },
  { name: "CLOSED HH 1", note: 49 },
  { name: "OPEN HH 1", note: 51 },
  { name: "CLOSED HH 2", note: 42 },
  { name: "OPEN HH 2", note: 44 },
  { name: "CLAP", note: 39 }
]
