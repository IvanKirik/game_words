export class App {
    private readonly canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement | null) {
        if (!canvas) {
            throw Error('Canvas element not found');
        }
        this.canvas = canvas;
    }

    public start(): void {

    }
}
