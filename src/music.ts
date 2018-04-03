import { assertNever } from "./utils";

export type MusicType = 'music' | 'piano' | 'voice';

export function musicList(type: MusicType) {
    return type ==='music' ? [
        "pi-001.mp3",
        "pi-002.mp3",
        "pi-003.mp3",
        "pi-004.mp3",
        "pi-005.mp3",
        "pi-006.mp3",
        "pi-007.mp3",
        "pi-008.mp3",
        "pi-009.mp3",
        "pi-010.mp3",        
    ] : type === 'piano' ? [
        "Joe Hisaishi - Howl's Moving Castle.mp3",
        "Kevin MacLeod - Merry Go.mp3"
    ] : type === 'voice' ? [        
        "Smeshariki - kuzinatra.mp3"
    ] : assertNever(type);
};

export const GAME_MUSIC_TYPES: MusicType[] = ['music', 'piano', 'voice'];

