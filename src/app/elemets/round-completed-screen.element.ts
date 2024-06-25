import { ICoordination, IRound } from '../types';
import {
  BACKGROUND_BTN,
  CANVAS_WIDTH,
  MAX_ROUNDS,
  SHADOW_BTN,
  TEXT_COLOR_WHITE,
} from '../constants.ts';
import { MouseService } from '../services';
import { drawBtnUtil } from '../utils';

export class RoundCompletedScreenElement {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly x: number;
  private readonly y: number;
  private readonly round: IRound;
  private readonly btn: ICoordination | null = null;
  private readonly mouse: MouseService;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    round: IRound,
    mouse: MouseService,
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.round = round;
    this.mouse = mouse;

    this.btn = {
      xStart: CANVAS_WIDTH / 2 - 330 / 2,
      xEnd: CANVAS_WIDTH / 2 - 330 / 2 + 330,
      yStart: this.y + 347,
      yEnd: this.y + 347 + 94,
    };
  }

  public render(): void {
    this.create();
  }

  public update(nextRound: () => void): void {
    if (
      this.btn &&
      this.mouse.click &&
      this.mouse.x > this.btn.xStart &&
      this.mouse.x < this.btn.xEnd &&
      this.mouse.y > this.btn.yStart &&
      this.mouse.y < this.btn.yEnd
    ) {
      nextRound();
    }
    if (
      this.btn &&
      this.mouse.touch &&
      this.mouse.touchX > this.btn.xStart &&
      this.mouse.touchX < this.btn.xEnd &&
      this.mouse.touchY > this.btn.yStart &&
      this.mouse.touchY < this.btn.yEnd
    ) {
      nextRound();
    }
  }

  private create(): void {
    this.ctx.fillStyle = TEXT_COLOR_WHITE;
    this.ctx.font = '37px VAG World';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`Уровень ${this.round.id}`, this.x, this.y);

    this.ctx.fillStyle = TEXT_COLOR_WHITE;
    this.ctx.font = '53px VAG World';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`Изумительно`, this.x, this.y + 43);

    this.createBtn();
  }

  private createBtn(): void {
    if (!this.btn) return;
    drawBtnUtil(
      this.ctx,
      this.btn.xStart,
      this.btn.yStart + 4,
      330,
      94,
      45,
      SHADOW_BTN,
      '',
      TEXT_COLOR_WHITE,
      0,
    );
    drawBtnUtil(
      this.ctx,
      this.btn.xStart,
      this.btn.yStart,
      330,
      94,
      45,
      BACKGROUND_BTN,
      `Уровень ${this.round.id >= MAX_ROUNDS ? 1 : this.round.id + 1}`,
      TEXT_COLOR_WHITE,
      40,
    );
  }
}
