import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MODAL_WIDTH,
  TOP_MARGIN_MODAL,
  TOP_MARGIN_TITLE,
} from './constants.ts';
import {
  GamePanelElement,
  GridElement,
  HintLettersElement,
  ModalElement,
  RoundCompletedScreenElement,
  TitleElement,
} from './elemets';
import { StateService, MouseService, ActiveTabService } from './services';
import Level1 from '../assets/data/1.json';
import Level2 from '../assets/data/2.json';
import Level3 from '../assets/data/3.json';
import { IGridCellSize } from './types';
import { calculateCellSize, checkWordUtil } from './utils';
import { lettersMapper } from './mappers';
import { merge, switchMap, tap } from 'rxjs';
import ModalImg from '../assets/images/popup_ribbon.png';

export class App {
  /** Canvas */
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;

  /** Elements */
  private gridElement: GridElement | undefined;
  private titleElement: TitleElement | undefined;
  private gamePanelElement: GamePanelElement | undefined;
  private hintLettersElement: HintLettersElement | undefined;
  private roundCompletedScreen: RoundCompletedScreenElement | undefined;
  private modalElement: ModalElement | undefined;

  /** Cell sizes depending on the number of words */
  private cellSize: IGridCellSize | undefined;

  /** Services */
  private readonly state: StateService;
  private readonly mouse: MouseService;
  private readonly activeTabService: ActiveTabService;

  /** Hint letters */
  private hints: string[] = [];

  /** Images */
  private modalHeaderImg: HTMLImageElement = new Image();

  /** Line settings */
  private isDrawing: boolean = false;
  private lastX: number = 0;
  private lastY: number = 0;

  constructor(canvas: HTMLCanvasElement | null) {
    if (!canvas) {
      throw Error('Canvas element not found');
    }

    this.modalHeaderImg.src = ModalImg;
    this.modalHeaderImg.onload;

    this.state = new StateService();
    this.mouse = new MouseService(canvas);
    this.activeTabService = new ActiveTabService(this.state);

    /** Added levels */
    this.state.updateRounds([Level1, Level2, Level3]);

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.init();
  }

  public start(): void {
    this.gameLoop();
  }

  private init(): void {
    this.state.currentRound$.subscribe(round => {
      if (round && this.ctx) {
        this.cellSize = calculateCellSize(round.words.map(item => item.word));

        this.titleElement = new TitleElement(
          this.ctx,
          this.canvas.width / 2,
          TOP_MARGIN_TITLE,
          round.id,
        );
        this.gridElement = new GridElement(
          this.ctx,
          round.words,
          this.cellSize.width,
        );
        this.gamePanelElement = new GamePanelElement(
          this.ctx,
          lettersMapper.toLetters(round.words),
          this.mouse,
        );
        this.hintLettersElement = new HintLettersElement(this.ctx);
      }
    });

    merge(this.mouse.mouseBtnState$, this.mouse.touchBtnState$)
      .pipe(
        tap(stateBtn => (this.isDrawing = stateBtn)),
        switchMap(btnState =>
          this.state.hintLetters$.pipe(
            tap(hintLetters => (this.hints = hintLetters)),
            switchMap(hintLetters =>
              this.state.currentRound$.pipe(
                tap(words => {
                  if (!words) return;
                  const word = checkWordUtil(hintLetters.join(''), words.words);
                  if (word && !btnState) {
                    this.state.updateCurrentRound(word.word);
                  }
                  if (!word && !btnState) {
                    this.state.clearHintLetters();
                  }
                }),
              ),
            ),
          ),
        ),
      )
      .subscribe();

    this.state.roundComplete$.subscribe(round => {
      if (round && this.ctx) {
        this.roundCompletedScreen = new RoundCompletedScreenElement(
          this.ctx,
          this.canvas.width / 2,
          257,
          round,
          this.mouse,
        );
      } else {
        this.roundCompletedScreen = undefined;
      }
    });

    this.state.warning$.subscribe(warning => {
      if (warning && this.ctx) {
        this.modalElement = new ModalElement(
          this.ctx,
          this.canvas.width / 2 - MODAL_WIDTH / 2,
          TOP_MARGIN_MODAL,
          this.modalHeaderImg,
          this.mouse,
        );
        document.querySelector('body')!.style.background = '#0d0f16';
      }
    });

    this.mouse.streamEvents$.subscribe(([from, to]) => {
      [this.lastX, this.lastY] = [from.x, from.y];
      this.drawLine(to);
    });
  }

  private gameLoop(): void {
    if (
      !this.ctx ||
      !this.gridElement ||
      !this.titleElement ||
      !this.gamePanelElement ||
      !this.hintLettersElement
    ) {
      return;
    }

    if (!this.isDrawing) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (this.roundCompletedScreen) {
      this.roundCompletedScreen.render();
      this.roundCompletedScreen.update(this.nextRound.bind(this));
    } else if (!this.roundCompletedScreen) {
      this.titleElement.render();
      this.gridElement.render();
      this.gamePanelElement.render();
      this.hintLettersElement.render(this.hints);
      this.gamePanelElement.update(this.addLetter.bind(this));
    }

    if (this.modalElement) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.modalElement.render();
      this.modalElement.update(this.updateToken.bind(this));
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private addLetter(letter: string): void {
    this.state.updateHintLetters(letter);
  }

  private nextRound(): void {
    this.state.nextRound();
  }

  private updateToken(): void {
    this.activeTabService.updateToken$.next(true);
  }

  private drawLine({ x, y }: { x: number; y: number }): void {
    if (!this.isDrawing || !this.ctx) return;
    this.ctx.strokeStyle = '#638EC4';
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 21;
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    [this.lastX, this.lastY] = [x, y];
  }
}
