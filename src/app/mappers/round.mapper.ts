import {IRound} from "../types";
import {MAX_ROUNDS} from "../constants.ts";

export class RoundMapper {
    public fromDto(wordsDto: { words: string[] }[]): IRound[] {
        const rounds: IRound[] = [];

        let roundCount = 0;
        let wordIndex = 0;

        while (roundCount < MAX_ROUNDS) {
            const words = wordsDto[wordIndex];

            rounds.push({
                id: roundCount + 1,
                completed: false,
                current: roundCount === 0,
                words: words.words.map(word => ({ completed: false, word }))
            });

            roundCount++;
            wordIndex = (wordIndex + 1) % wordsDto.length;
        }

        return rounds;
    }
}

export const roundMapper = new RoundMapper();
