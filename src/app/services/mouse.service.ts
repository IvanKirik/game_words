import {
  BehaviorSubject,
  fromEvent,
  map,
  merge,
  Observable,
  pairwise,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

export class MouseService {
  private readonly element: HTMLCanvasElement;
  private rect: DOMRect;
  private computedStyles: CSSStyleDeclaration;
  private readonly canvasComputedStyleWidth: number;
  private readonly canvasComputedStyleHeight: number;
  private readonly scaleX: number;
  private readonly scaleY: number;

  /** Touch coordination */
  public touchX = 0;
  public touchY = 0;

  /** Mouse coordination */
  public x = 0;
  public y = 0;

  public touch: boolean = false;
  public click: boolean = false;

  public mouseDown$ = new BehaviorSubject<boolean>(false);
  public touchDown$ = new BehaviorSubject<boolean>(false);

  public streamEvents$: Observable<{ x: number; y: number }[]>;
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

    /** Mouse events */
    const mouseMove$ = fromEvent(this.element, 'mousemove');
    const mouseDown$ = fromEvent(this.element, 'mousedown');
    const mouseUp$ = fromEvent(this.element, 'mouseup');
    const mouseOut$ = fromEvent(this.element, 'mouseout');

    mouseMove$
      .pipe(
        map((e: unknown) => {
          const event = e as MouseEvent;
          event.preventDefault();
          this.x = (event.clientX - this.rect.left) / this.scaleX;
          this.y = (event.clientY - this.rect.top) / this.scaleY;
        }),
      )
      .subscribe();

    this.mouseBtnState$ = merge(
      mouseUp$.pipe(
        tap(e => (e.preventDefault(), (this.click = true))),
        map(() => false),
      ),
      mouseDown$.pipe(
        tap(e => e.preventDefault()),
        map(() => true),
      ),
    ).pipe(tap(v => this.mouseDown$.next(v)));

    const streamMouse$ = mouseDown$.pipe(
      switchMap(() =>
        mouseMove$.pipe(
          map((e: unknown) => {
            const event = e as MouseEvent;
            event.preventDefault();
            const { x, y } = {
              x: (event.clientX - this.rect.left) / this.scaleX,
              y: (event.clientY - this.rect.top) / this.scaleY,
            };
            return { x, y };
          }),
          pairwise(),
          takeUntil(mouseUp$),
          takeUntil(mouseOut$),
        ),
      ),
    );

    /** Touch events */
    const touchStart$ = fromEvent(this.element, 'touchstart');
    const touchMove$ = fromEvent(this.element, 'touchmove');
    const touchEnd$ = fromEvent(this.element, 'touchend');
    const touchCancel$ = fromEvent(this.element, 'touchcancel');

    this.touchBtnState$ = merge(
      touchEnd$.pipe(
        tap(e => e.preventDefault()),
        map(() => false),
      ),
      touchStart$
        .pipe(
          tap((e: unknown) => {
            const event = e as TouchEvent;
            event.preventDefault();
            this.touch = true;
            const touch = event.touches[0];
            this.touchX = (touch.clientX - this.rect.left) / this.scaleX;
            this.touchY = (touch.clientY - this.rect.top) / this.scaleY;
          }),
          map(() => true),
        )
        .pipe(tap(v => this.touchDown$.next(v))),
    );

    const touchStream$ = touchStart$.pipe(
      switchMap(() =>
        touchMove$.pipe(
          map((e: unknown) => {
            const event = e as TouchEvent;
            event.preventDefault();
            const touch = event.touches[0];
            return {
              x: (touch.clientX - this.rect.left) / this.scaleX,
              y: (touch.clientY - this.rect.top) / this.scaleY,
            };
          }),
          pairwise(),
          takeUntil(touchEnd$),
          takeUntil(touchCancel$),
        ),
      ),
    );

    this.streamEvents$ = merge(streamMouse$, touchStream$);
  }

  public tick() {
    this.click = false;
    this.touch = false;
  }

  private update(element: HTMLCanvasElement) {
    if (window) {
      window.addEventListener('scroll', () => {
        this.rect = element.getBoundingClientRect();
        this.computedStyles = getComputedStyle(element);
      });
    }
  }
}
