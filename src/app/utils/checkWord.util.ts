import {WordRound} from "../types";

export function checkWordUtil(word: string, words: WordRound[]): WordRound | undefined {
    return words.find((wordTemp) => !wordTemp.completed && wordTemp.word.toUpperCase() === word.toUpperCase());
}
