import { IBasicElement, WordRound } from '../types'
import { RowElement } from './row.element.ts'
import { CANVAS_WIDTH, TOP_MARGIN_GRID, WORD_PADDING } from '../constants.ts'

export class GridElement implements IBasicElement {
  public readonly ctx: CanvasRenderingContext2D
  private readonly words: WordRound[]
  private readonly size: number
  private readonly rows: RowElement[] = []

  constructor(ctx: CanvasRenderingContext2D, words: WordRound[], size: number) {
    this.ctx = ctx
    this.words = words
    this.size = size

    this.rows = this.create()
  }

  public create(): RowElement[] {
    const rows: RowElement[] = []
    const availableWidth = CANVAS_WIDTH - WORD_PADDING * 2
    this.words.forEach((word, index) => {
      const row = index * (this.size + WORD_PADDING) + TOP_MARGIN_GRID
      const rowPadding = (availableWidth - word.word.length * this.size) / 2
      rows.push(new RowElement(this.ctx, rowPadding, row, this.size, word))
    })
    return rows
  }

  public render(): void {
    this.rows.forEach(row => row.render())
  }

  public update(): void {}
}
