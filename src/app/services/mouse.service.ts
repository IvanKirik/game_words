import {fromEvent, map, merge, Observable, pairwise, switchMap, takeUntil} from "rxjs";

export class MouseService {
    private readonly element: HTMLCanvasElement;
    private rect:  DOMRect;
    private computedStyles: CSSStyleDeclaration;
    private readonly canvasComputedStyleWidth: number;
    private readonly canvasComputedStyleHeight: number;
    private readonly scaleX: number;
    private readonly scaleY: number;

    /** Touch */
    private touch: Touch | undefined;
    public touchX = 0;
    public touchY = 0;
    public touchMove = false;
    public tap = false;

    /** Mouse */
    public x = 0;
    public y = 0;
    public left = false;
    public pLeft = false;
    public right = false;
    public pRight = false;
    public middle = false;
    public pMiddle = false;
    public over = false;

    public down = false;
    public up = true;

    public tick = this.mouseTick.bind(this);

    public stream$: Observable<any>;
    public touchStream$: Observable<any>;

    public mouseUp$: Observable<any>;
    public mouseBtnState$: Observable<boolean>;
    public touchBtnState$: Observable<boolean>;

    constructor(element: HTMLCanvasElement | null) {
        if (!element) {
            throw Error('Element element not found');
        }
        this.element = element;
        this.rect = element.getBoundingClientRect();
        this.computedStyles = getComputedStyle(element);
        this.canvasComputedStyleWidth = parseInt(this.computedStyles.width);
        this.canvasComputedStyleHeight = parseInt(this.computedStyles.height);
        this.scaleX = this.canvasComputedStyleWidth / element.width;
        this.scaleY = this.canvasComputedStyleHeight / element.height;

        this.update(element);

        this.tick = this.mouseTick.bind(this);

        this.element.addEventListener('mouseenter', this.mouseenterHandler.bind(this));
        this.element.addEventListener('mousemove', this.mousemoveHandler.bind(this));
        this.element.addEventListener('mouseleave', this.mouseleaveHandler.bind(this));
        this.element.addEventListener('mousedown', this.mousedownHandler.bind(this));
        this.element.addEventListener('mouseup', this.mouseupHandler.bind(this));

        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));

        const mouseMove$ = fromEvent(this.element, 'mousemove');
        const mouseDown$ = fromEvent(this.element, 'mousedown');
        this.mouseUp$ = fromEvent(this.element, 'mouseup');
        const mouseOut$ = fromEvent(this.element, 'mouseout');

        this.mouseBtnState$ = merge(
            this.mouseUp$.pipe(map(() => false)),
            mouseDown$.pipe(map(() => true))
        )

        this.stream$ = mouseDown$
            .pipe(
                switchMap(() => mouseMove$
                    .pipe(
                        map((e: unknown) => {
                            const event = e as MouseEvent;
                            return {
                                x: (event.clientX - this.rect.left) / this.scaleX,
                                y: (event.clientY - this.rect.top) / this.scaleY,
                            }
                        }),
                        pairwise(),
                        takeUntil(this.mouseUp$),
                        takeUntil(mouseOut$),
                    )
                )
            )

        const touchStart$ = fromEvent(this.element, 'touchstart');
        const touchMove$ = fromEvent(this.element, 'touchmove');
        const touchEnd$ = fromEvent(this.element, 'touchend');
        const touchCancel$ = fromEvent(this.element, 'touchcancel');

        this.touchBtnState$ = merge(
            touchEnd$.pipe(map(() => false)),
            touchStart$.pipe(map(() => true))
        );

        this.touchStream$ = touchStart$
            .pipe(
                switchMap(() => touchMove$
                    .pipe(
                        map((e: unknown) => {
                            const event = e as TouchEvent;
                            const touch = event.touches[0]; // Будем обрабатывать только первое касание
                            return {
                                x: (touch.clientX - this.rect.left) / this.scaleX,
                                y: (touch.clientY - this.rect.top) / this.scaleY,
                            };
                        }),
                        pairwise(),
                        takeUntil(touchEnd$),
                        takeUntil(touchCancel$),
                    )
                )
            );
    }

    private mouseTick() {
        this.pLeft = this.left;
        this.pRight = this.right;
        this.pMiddle = this.middle;
        this.tap = false;
    }

    private handleTouchStart(event: TouchEvent) {
        event.preventDefault();
        this.touch = event.touches[0];
        this.tap = event.isTrusted;

        this.touchX = (this.touch.clientX - this.rect.left) / this.scaleX;
        this.touchY = (this.touch.clientY - this.rect.top) / this.scaleY;
    }

    private handleTouchMove(event:  TouchEvent) {
        this.touch = event.touches[0];
        this.touchMove = !!this.touch;
        this.touchX = (this.touch.clientX - this.rect.left) / this.scaleX;
        this.touchY = (this.touch.clientY - this.rect.top) / this.scaleY;
    }

    private mouseenterHandler() {
        this.over = true;
    }

    private mousemoveHandler(event: MouseEvent) {
        this.x = (event.clientX - this.rect.left) / this.scaleX;
        this.y = (event.clientY - this.rect.top) / this.scaleY;
    }

    private mouseleaveHandler() {
        this.over = false;
    }

    private mousedownHandler(event: MouseEvent) {
        if (event.buttons === 1) {
            this.left = true;
            this.down = true;
            this.up = false;
        } else if (event.buttons === 4) {
            event.preventDefault();
            this.middle = true;
        } else if (event.buttons === 2) {
            this.right = true;
        }
    }

    private mouseupHandler(event: MouseEvent) {
        this.down = false;
        this.up = true;
        this.left = event.buttons === 1;
        this.middle = event.buttons === 4;
        this.right = event.buttons === 2;
    }

    private update(element: HTMLCanvasElement) {
        if (window) {
            window.addEventListener('scroll', () => {
                this.rect = element.getBoundingClientRect();
                this.computedStyles = getComputedStyle(element);
            })
        }
    }
}
