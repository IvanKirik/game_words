import { MouseService } from '../services';

export class LetterElement {
  public readonly radius = 47;
  private ctx: CanvasRenderingContext2D;
  public readonly x: number;
  public readonly y: number;
  private readonly letter: string;
  private mainBackground: string = '#fff';
  private addBackground: string = '#58595B';

  private counter = 0;

  private readonly mouse: MouseService;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    letter: string,
    mouse: MouseService,
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.letter = letter;
    this.mouse = mouse;
  }

  public render() {
    this.createCircle(this.addBackground, this.x, this.y + 5);
    this.createCircle(this.mainBackground, this.x, this.y, this.letter);
  }

  public update(onClick: (letter: string) => void): void {
    if (
      this.checkCoordination(this.mouse.x, this.mouse.y) &&
      this.mouse.mouseDown$.getValue()
    ) {
      if (this.counter === 0) {
        onClick(this.letter);
        this.counter++;
      }
      this.mainBackground = '#E96FA4';
      this.addBackground = '#AF638C';
    }

    if (
      this.checkCoordination(this.mouse.touchX, this.mouse.touchY) &&
      this.mouse.touchDown$.getValue()
    ) {
      if (this.counter === 0) {
        onClick(this.letter);
        this.counter++;
      }
      this.mainBackground = '#E96FA4';
      this.addBackground = '#AF638C';
    }

    if (
      !this.checkCoordination(this.mouse.x, this.mouse.y) &&
      this.mouse.mouseDown$.getValue()
    ) {
      this.counter = 0;
    }

    if (
      !this.checkCoordination(this.mouse.touchX, this.mouse.touchY) &&
      this.mouse.touchDown$.getValue()
    ) {
      this.counter = 0;
    }

    if (
      !this.mouse.mouseDown$.getValue() &&
      !this.mouse.touchDown$.getValue()
    ) {
      this.counter = 0;
      this.mainBackground = '#fff';
      this.addBackground = '#58595B';
    }
  }

  private createCircle(
    background: string,
    x: number,
    y: number,
    letter?: string,
  ): void {
    this.ctx.save();
    this.ctx.fillStyle = background;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.fillStyle = '#4D4D4D'; // Цвет текста
    this.ctx.font = '57px VAG World'; // Размер и шрифт текста
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    if (letter) {
      this.ctx.fillText(letter, x, y);
    }
    this.ctx.restore();
  }

  private checkCoordination(x: number, y: number): boolean {
    const startX = this.x - this.radius;
    const endX = this.x + this.radius;
    const startY = this.y - this.radius;
    const endY = this.y + this.radius;
    return startX < x && endX > x && startY < y && endY > y;
  }
}
