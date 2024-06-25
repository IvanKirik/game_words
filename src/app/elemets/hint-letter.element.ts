import { drawRoundRect } from '../utils'
import { TOP_MARGIN_HINT } from '../constants.ts'

export class HintLetterElement {
  private readonly cellSize = 42
  private readonly topMargin = TOP_MARGIN_HINT
  private readonly cornerRadius = 12
  private readonly ctx: CanvasRenderingContext2D
  private readonly letter: string = ''
  public readonly x: number
  public readonly y: number

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    letter: string,
  ) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.letter = letter
  }

  public render(): void {
    drawRoundRect(
      this.ctx,
      this.x,
      this.topMargin,
      this.cellSize,
      this.cornerRadius,
      '#fff',
      this.letter,
      '#4D4D4D',
      30,
    )
  }
}
