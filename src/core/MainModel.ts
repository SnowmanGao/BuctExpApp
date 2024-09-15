type JikkenData = {
  title: string
  place: string
  teacher: string
}

type StudentData = {
  class: string
  batch: number
  group: number
}

type RawJikken = {
  [lab_id: string]: [title: string, place: string, teacher: string]
}

type RawStudent = {
  class: string[]
  student: { [sid: string]: [batch: number, class_: number, group: number] }
}

export type { JikkenData, StudentData, RawJikken, RawStudent }