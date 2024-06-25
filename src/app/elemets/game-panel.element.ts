import { LetterElement } from './letter.element.ts';
import {
  BACKGROUND_CIRCLE,
  CANVAS_WIDTH,
  LETTER_RADIUS,
  TOP_MARGIN_GAME_PANEL,
} from '../constants.ts';
import { drawCircleUtil } from '../utils';
import { MouseService } from '../services';

export class GamePanelElement {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly letters: string[];
  private lettersEntity: LetterElement[];
  private readonly mouse: MouseService;

  constructor(
    ctx: CanvasRenderingContext2D,
    letters: string[],
    mouse: MouseService,
  ) {
    this.letters = letters;
    this.ctx = ctx;
    this.mouse = mouse;
    this.lettersEntity = this.createLetters(this.letters);
  }

  private createLetters(letters: string[]): LetterElement[] {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = TOP_MARGIN_GAME_PANEL;

    const angleStep = (2 * Math.PI) / letters.length;

    const lettersEntity: LetterElement[] = [];
    for (let i = 0; i < letters.length; i++) {
      const angle = i * angleStep;
      const x = centerX + LETTER_RADIUS * Math.cos(angle);
      const y = centerY + LETTER_RADIUS * Math.sin(angle);
      lettersEntity.push(
        new LetterElement(this.ctx, x, y, letters[i], this.mouse),
      );
    }
    return lettersEntity;
  }

  private createCircle() {
    drawCircleUtil(
      this.ctx,
      CANVAS_WIDTH / 2,
      TOP_MARGIN_GAME_PANEL,
      LETTER_RADIUS,
      BACKGROUND_CIRCLE,
      20,
    );
  }

  public render(): void {
    this.createCircle();
    this.lettersEntity.forEach(letter => letter.render());
  }

  public update(addLetter: (letter: string) => void): void {
    this.lettersEntity.forEach(letter => letter.update(addLetter));
  }
}
