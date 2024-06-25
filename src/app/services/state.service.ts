import {CURRENT_GAME_STATE_TOKEN, CURRENT_ROUND_TOKEN} from "../constants.ts";
import {BehaviorSubject, map, switchMap, tap} from "rxjs";
import {IRound} from "../types";
import {roundMapper} from "../mappers";

export class StateService {
    private readonly currentRoundIndex = localStorage.getItem(CURRENT_ROUND_TOKEN);
    private readonly currentGameState = localStorage.getItem(CURRENT_GAME_STATE_TOKEN);

    private readonly currentRoundIndex$ = new BehaviorSubject<number>(this.currentRoundIndex ? +this.currentRoundIndex : 0);
    private readonly warningSbj$ = new BehaviorSubject<boolean>(false);
    private readonly roundsSbj$ = new BehaviorSubject<IRound[]>([]);
    private readonly hintLettersSbj$ = new BehaviorSubject<string[]>([]);
    private readonly roundCompletedSubj$ = new BehaviorSubject<null | IRound>(null);

    public readonly checkedSbj$ = new BehaviorSubject<boolean>(false);

    public readonly checked$ = this.checkedSbj$.asObservable();
    public readonly warning$ = this.warningSbj$.asObservable();
    public readonly roundComplete$ = this.roundCompletedSubj$.asObservable();
    public readonly hintLetters$ = this.hintLettersSbj$.asObservable();
    public readonly rounds$ = this.roundsSbj$.asObservable()
        .pipe(
            tap((rounds) => {
                if(!this.warningSbj$.getValue()) {
                    localStorage.setItem(CURRENT_GAME_STATE_TOKEN, JSON.stringify(rounds))
                }
            })
        )
    public readonly currentRound$ = this.currentRoundIndex$.asObservable()
        .pipe(
            tap((index) => localStorage.setItem(CURRENT_ROUND_TOKEN, index.toString())),
            switchMap((index) => this.rounds$
                .pipe(
                    map((rounds) => rounds[index]),
                    tap((round) => {
                        if (!round.words.find((word) => !word.completed)) {
                            this.roundCompletedSubj$.next(round);
                        } else {
                            this.roundCompletedSubj$.next(null);
                        }
                    })
                ))
        )

    public nextRound() {
        const current = this.currentRoundIndex$.getValue();
        if (current + 1 < this.roundsSbj$.getValue().length) {
            this.currentRoundIndex$.next(current + 1);
            this.roundCompletedSubj$.next(null);
        } else {
            this.clearResult();
            this.currentRoundIndex$.next(0);
            this.roundCompletedSubj$.next(null);
        }
    }

    public updateRounds(words: { words: string[] }[]): void {
        if (this.currentGameState) {
            this.roundsSbj$.next(JSON.parse(this.currentGameState))
        } else {
            this.roundsSbj$.next(roundMapper.fromDto(words));
        }
    }

    public updateHintLetters(letter: string): void {
        this.hintLettersSbj$.next([...this.hintLettersSbj$.getValue(), letter]);
    }

    public clearHintLetters(): void {
        this.hintLettersSbj$.next([]);
    }

    public updateCurrentRound(word: string): void {
        this.roundsSbj$.next(
            this.roundsSbj$.getValue().map((round, index) => {
                if (index === this.currentRoundIndex$.getValue()) {
                    return {
                        ...round,
                        words: round.words.map((wordTemp) => {
                            if (word === wordTemp.word) {
                                return {
                                    ...wordTemp,
                                    completed: true,
                                }
                            }
                            return wordTemp;
                        })
                    }
                }
                return round;
            })
        )
    }

    public removeByIndex(index: number): void {
        const letters = this.hintLettersSbj$.getValue();
        if (index > -1 && index < letters.length) {
            const [letter] = letters.splice(index, 1);
            this.hintLettersSbj$.next(letters.filter((item) => letter !== item));
        }
    }

    public warning(open: boolean): void {
        this.warningSbj$.next(open);
    }

    private clearResult(): void {
        const rounds = this.roundsSbj$.getValue().map((item, index) => {
            return {
                ...item,
                completed: false,
                current: index === 0,
                words: item.words.map((word) => {
                    return {
                        ...word,
                        completed: false,
                    }
                })
            }
        })
        this.roundsSbj$.next(rounds);
    }
}
