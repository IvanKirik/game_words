import { WordRound } from '../types';
import { ColElement } from './col.element.ts';
import { WORD_PADDING } from '../constants.ts';

export class RowElement {
  private readonly x: number;
  private readonly y: number;
  private readonly size: number;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly word: WordRound;

  private readonly cools: ColElement[] = [];

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    words: WordRound,
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = size;
    this.word = words;

    this.cools = this.create();
  }

  public render(): void {
    this.cools.forEach(col => col.render());
  }

  private create(): ColElement[] {
    const cools: ColElement[] = [];
    this.word.word.split('').forEach((letter, index) => {
      const col = this.x + index * (this.size + WORD_PADDING);
      cools.push(
        new ColElement(
          this.ctx,
          col,
          this.y,
          this.size,
          letter,
          !this.word.completed,
        ),
      );
    });
    return cools;
  }
}
