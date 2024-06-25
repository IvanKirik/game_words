import { WordRound } from '../types';

export class LettersMapper {
  public toLetters(words: WordRound[]): string[] {
    return [...new Set([...words.map(word => word.word).join('')])]
      .reverse()
      .map((letter: string) => letter.toUpperCase());
  }
}

export const lettersMapper = new LettersMapper();
