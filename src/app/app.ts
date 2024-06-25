import {CANVAS_HEIGHT, CANVAS_WIDTH, TOP_MARGIN_TITLE} from "./constants.ts";
import {GamePanelElement, GridElement, HintLettersElement, RoundCompletedScreenElement, TitleElement} from "./elemets";
import {StateService, MouseService, ActiveTabService} from "./services";
import Level1 from '../assets/data/1.json';
import Level2 from '../assets/data/2.json';
import Level3 from '../assets/data/3.json';
import {IGridCellSize} from "./types";
import {calculateCellSize, checkWordUtil} from "./utils";
import {lettersMapper} from "./mappers";
import {switchMap, tap} from "rxjs";

export class App {
    /** Canvas */
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx:  CanvasRenderingContext2D | null;

    /** Elements */
    private gridElement: GridElement | undefined;
    private titleElement: TitleElement | undefined;
    private gamePanelElement: GamePanelElement | undefined;
    private hintLettersElement: HintLettersElement | undefined;
    private roundCompletedScreen: RoundCompletedScreenElement | undefined;

    /** Cell sizes depending on the number of words */
    private cellSize: IGridCellSize | undefined;

    /** Services */
    private readonly state: StateService;
    private readonly mouse: MouseService;
    private readonly activeTabService: ActiveTabService;

    /** Data */
    private hints: string[] = [];

    constructor(canvas: HTMLCanvasElement | null) {
        if (!canvas) {
            throw Error('Canvas element not found');
        }

        this.state = new StateService();
        this.mouse = new MouseService(canvas);
        this.activeTabService = new ActiveTabService(this.state);

        /** Added levels */
        this.state.updateRounds([Level1, Level2, Level3])

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
        this.state.currentRound$.subscribe((round) => {
            if (round && this.ctx) {
                this.cellSize = calculateCellSize(round.words.map((item) => item.word));

                this.titleElement = new TitleElement(this.ctx, this.canvas.width / 2, TOP_MARGIN_TITLE, round.id);
                this.gridElement = new GridElement(this.ctx, round.words, this.cellSize.width);
                this.gamePanelElement = new GamePanelElement(this.ctx, lettersMapper.toLetters(round.words), this.mouse);
                this.hintLettersElement = new HintLettersElement(this.ctx);
            }
        })
        this.mouse.mouseBtnState$
            .pipe(
                switchMap((btnState) => this.state.hintLetters$.pipe(
                    tap((hintLetters) => this.hints = hintLetters),
                    switchMap((hintLetters) =>  this.state.currentRound$
                        .pipe(
                            tap((words) => {
                                if (!words) return;
                                const word = checkWordUtil(hintLetters.join(''), words.words);
                                if (word && !btnState) {
                                    this.state.updateCurrentRound(word.word);
                                }
                                if (!word && !btnState) {
                                    this.state.clearHintLetters();
                                }
                            })
                        )
                    ))
                )).subscribe()

        this.mouse.touchBtnState$
            .pipe(
                // tap((v) => this.touch = v),
                switchMap((btnState) => this.state.hintLetters$.pipe(
                    tap((hintLetters) => this.hints = hintLetters),
                    switchMap((hintLetters) =>  this.state.currentRound$
                        .pipe(
                            tap((words) => {
                                if (!words) return;
                                const word = checkWordUtil(hintLetters.join(''), words.words);
                                if (word && !btnState) {
                                    this.state.updateCurrentRound(word.word);
                                }
                                if (!word && !btnState) {
                                    this.state.clearHintLetters();
                                }
                            })
                        )
                    ))
                )).subscribe()

        this.state.roundComplete$.subscribe((round) => {
            if (round && this.ctx) {
                this.roundCompletedScreen = new RoundCompletedScreenElement(this.ctx, this.canvas.width / 2, 257, round, this.mouse)
            } else {
                this.roundCompletedScreen = undefined;
            }
        })

        this.state.warning$.subscribe((v) => {
            if (v) {
                // this.modal = new Modal(this.ctx!, this.canvas.width / 2 - MODAL_WIDTH / 2, TOP_MARGIN_MODAL, this.img);
            }
        })
    }

    private gameLoop(): void {
        if (!this.ctx || !this.gridElement || !this.titleElement || !this.gamePanelElement || !this.hintLettersElement) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.roundCompletedScreen) {
            this.roundCompletedScreen.render();
            this.roundCompletedScreen.update(this.mouse, this.nextRound.bind(this));
        } else if (!this.roundCompletedScreen){
            this.titleElement.render();
            this.gridElement.render();
            this.gamePanelElement.render();
            this.hintLettersElement.render(this.hints);


            this.gamePanelElement.update(this.addLetter.bind(this));
        }

        this.mouse.tick();
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
}
