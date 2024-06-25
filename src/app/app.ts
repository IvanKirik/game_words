import {CANVAS_HEIGHT, CANVAS_WIDTH, TOP_MARGIN_TITLE} from "./constants.ts";
import {GamePanelElement, GridElement, TitleElement} from "./elemets";
import {StateService} from "./services";
import Level1 from '../assets/data/1.json';
import Level2 from '../assets/data/2.json';
import Level3 from '../assets/data/3.json';
import {IGridCellSize} from "./types/grid-cell-size.interface.ts";
import {calculateCellSize} from "./utils";
import {lettersMapper} from "./mappers";
import {MouseService} from "./services/mouse.service.ts";

export class App {
    /** Canvas */
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx:  CanvasRenderingContext2D | null;

    /** Elements */
    private gridElement: GridElement | undefined;
    private titleElement: TitleElement | undefined;
    private gamePanelElement: GamePanelElement | undefined;
    private roundCompletedScreen: any | undefined;

    /** Cell sizes depending on the number of words */
    private cellSize: IGridCellSize | undefined;

    /** Services */
    private readonly state: StateService;
    private readonly mouse: MouseService;

    constructor(canvas: HTMLCanvasElement | null) {
        if (!canvas) {
            throw Error('Canvas element not found');
        }

        this.state = new StateService();
        this.mouse = new MouseService(canvas);

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
                this.gamePanelElement = new GamePanelElement(this.ctx, lettersMapper.toLetters(round.words), this.mouse)
            }
        })
    }

    private gameLoop(): void {
        if (!this.ctx || !this.gridElement || !this.titleElement) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.roundCompletedScreen) {
            this.roundCompletedScreen.render();

        } else if (!this.roundCompletedScreen){
            this.titleElement.render();
            this.gridElement.render();
            this.gamePanelElement?.render();



            this.gamePanelElement?.update(this.addLetter.bind(this));
        }

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private addLetter(letter: string): void {
        this.state.updateHintLetters(letter);
    }
}
