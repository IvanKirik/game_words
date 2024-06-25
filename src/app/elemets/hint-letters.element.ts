import { HintLetterElement } from './hint-letter.element.ts';
import { CANVAS_WIDTH, TOP_MARGIN_HINT } from '../constants.ts';

export class HintLettersElement {
  private readonly ctx: CanvasRenderingContext2D;
  private hintLettersEntity: HintLetterElement[] = [];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public render(hint: string[]) {
    if (hint) {
      this.hintLettersEntity = this.createLetters(hint);
      this.hintLettersEntity.forEach(letter => letter.render());
    }
  }

  private createLetters(hint: string[]) {
    const cellSize = 42;
    const wordPadding = 3;
    const topMargin = TOP_MARGIN_HINT;

    const totalWidth = hint.length * (cellSize + wordPadding) - wordPadding;

    this.ctx.clearRect(0, TOP_MARGIN_HINT, CANVAS_WIDTH, 42);

    let x = (CANVAS_WIDTH - totalWidth) / 2;
    const letters: HintLetterElement[] = [];
    hint.forEach((letter, i) => {
      const col = x + i * (cellSize + wordPadding);
      letters.push(new HintLetterElement(this.ctx, col, topMargin, letter));
    });
    return letters;
  }
}
