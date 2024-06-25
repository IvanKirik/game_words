import { ICoordination } from '../types';
import {
  BACKGROUND_BTN,
  CANVAS_WIDTH,
  MODAL_HEIGHT,
  MODAL_TEXT_DESCRIPTION,
  MODAL_TEXT_TITLE,
  MODAL_WIDTH,
  SHADOW_BTN,
  TEXT_COLOR_DESCRIPTION,
  TEXT_COLOR_WHITE,
} from '../constants.ts';
import { MouseService } from '../services';
import { drawBtnUtil } from '../utils';

export class ModalElement {
  private readonly ctx: CanvasRenderingContext2D;
  public readonly x: number;
  public readonly y: number;
  private readonly btn: ICoordination | null = null;
  private readonly description: string[] = MODAL_TEXT_DESCRIPTION;
  private readonly title: string[] = MODAL_TEXT_TITLE;
  private readonly img: HTMLImageElement;
  private readonly mouse: MouseService;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    img: HTMLImageElement,
    mouse: MouseService,
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.img = img;
    this.mouse = mouse;

    this.btn = {
      xStart: CANVAS_WIDTH / 2 - 306 / 2,
      xEnd: CANVAS_WIDTH / 2 - 306 / 2 + 306,
      yStart: this.y + 320,
      yEnd: this.y + 320 + 87,
    };
  }

  public render(): void {
    this.create();
  }

  public update(updateToken: () => void): void {
    if (
      this.btn &&
      this.mouse.clickSbj$.getValue() &&
      this.mouse.x > this.btn.xStart &&
      this.mouse.x < this.btn.xEnd &&
      this.mouse.y > this.btn.yStart &&
      this.mouse.y < this.btn.yEnd
    ) {
      updateToken();
    }
    if (
      this.btn &&
      this.mouse.touchSbj$.getValue() &&
      this.mouse.touchX > this.btn.xStart &&
      this.mouse.touchX < this.btn.xEnd &&
      this.mouse.touchY > this.btn.yStart &&
      this.mouse.touchY < this.btn.yEnd
    ) {
      updateToken();
    }
  }

  private create(): void {
    drawBtnUtil(
      this.ctx,
      this.x,
      this.y,
      MODAL_WIDTH,
      MODAL_HEIGHT,
      40,
      TEXT_COLOR_WHITE,
      '',
      '',
      0,
    );
    this.ctx.drawImage(
      this.img,
      CANVAS_WIDTH / 2 - 384 / 2,
      this.y - 17,
      384,
      113,
    );
    this.createBtn();
    this.title.forEach((text, i) => {
      let y = 370 + 45 * i;
      this.createDescription(text, y, 40, TEXT_COLOR_WHITE);
    });
    this.description.forEach((text, i) => {
      let y = 491 + 36 * i;
      this.createDescription(text, y, 32, TEXT_COLOR_DESCRIPTION);
    });
  }

  private createBtn(): void {
    if (!this.btn) return;
    drawBtnUtil(
      this.ctx,
      this.btn.xStart,
      this.btn.yStart + 4,
      306,
      87,
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
      306,
      87,
      45,
      BACKGROUND_BTN,
      `Обновить`,
      TEXT_COLOR_WHITE,
      40,
    );
  }

  private createDescription(
    text: string,
    y: number,
    fontSize: number,
    color: string,
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px VAG World`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, CANVAS_WIDTH / 2, y);
  }
}
