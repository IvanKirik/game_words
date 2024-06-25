import { TEXT_COLOR_WHITE } from '../constants.ts';

export class TitleElement {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly x: number;
  private readonly y: number;
  private readonly round: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    round: number,
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.round = round;
  }

  public render(): void {
    this.create();
  }

  private create(): void {
    this.ctx.fillStyle = TEXT_COLOR_WHITE;
    this.ctx.font = '30px VAG World';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`Уровень ${this.round}`, this.x, this.y);
  }
}
