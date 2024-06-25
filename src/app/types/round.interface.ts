export interface IRound {
  id: number
  completed: boolean
  current: boolean
  words: WordRound[]
}

export interface WordRound {
  completed: boolean
  word: string
}
