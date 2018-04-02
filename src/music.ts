import { assertNever } from "./utils";

export type MusicType = 'music' | 'piano' | 'voice';

export function musicList(type: MusicType) {
    return type ==='music' ? [
        "EIHWAZ - Delusion.mp3",
        "Magni Animi Viri - Heroes.mp3",
        "Marty Friedman - Trance.mp3",
        "Power Tale - Guest.mp3",
        "rock&opera - queen of night.mp3"
    ] : type === 'piano' ? [
        "Joe Hisaishi - Howl's Moving Castle.mp3",
        "Kevin MacLeod - Merry Go.mp3"
    ] : type === 'voice' ? [
        "Van Canto - Wishmaster.mp3",
        "Smeshariki - kuzinatra.mp3"
    ] : assertNever(type);
};

export const GAME_MUSIC_TYPES: MusicType[] = ['music', 'piano', 'voice'];

