import {
  CELL_BACKGROUND,
  CELL_BACKGROUND_GREEN,
  TEXT_COLOR,
} from '../constants.ts';
import { drawRoundRect } from '../utils';

export class ColElement {
  private readonly x: number;
  private readonly y: number;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly size: number;
  private readonly letter: string;
  private hide: boolean = true;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    letter: string,
    hide: boolean,
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = size;
    this.letter = letter;
    this.hide = hide;
  }

  public render(): void {
    this.create();
  }

  public update(hide: boolean): void {
    this.hide = hide;
  }

  private create() {
    drawRoundRect(
      this.ctx,
      this.x,
      this.y,
      this.size,
      12,
      this.hide ? CELL_BACKGROUND : CELL_BACKGROUND_GREEN,
      !this.hide ? this.letter : '',
      this.hide ? TEXT_COLOR : CELL_BACKGROUND,
      42,
    );
  }
}
