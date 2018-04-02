import { assertNever } from "./utils";

export type MusicType = 'music' | 'piano' | 'voice';

export function musicList(type: MusicType) {
    return type ==='music' ? [
        "EIHWAZ - Delusion.mp3",
        "Magni Animi Viri - Heroes.mp3",
        "Marty Friedman - Trance.mp3",
        "Power Tale - Гость извне.mp3",
        "rock&opera - Царица ночи.mp3"
    ] : type === 'piano' ? [
        "Joe Hisaishi - Howl's Moving Castle.mp3",
        "Kevin MacLeod - Merry Go.mp3"
    ] : type === 'voice' ? [
        "Van Canto - Wishmaster.mp3",
        "Смешарики - кузинатра.mp3"
    ] : assertNever(type);
};

export const GAME_MUSIC_TYPES: MusicType[] = ['music', 'piano', 'voice'];

