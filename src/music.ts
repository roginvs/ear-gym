import { assertNever } from "./utils";
import l from "./lang";

export type MusicType = "music" | "piano" | "drums" | "electricguitar";

export function musicList(type: MusicType) {
    return type === "music"
        ? [
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
              "epidemia-001.mp3",
              "epidemia-002.mp3",
              "epidemia-003.mp3",
              "epidemia-004.mp3",
              "epidemia-005.mp3",
          ]
        : type === "piano"
            ? ["piano-001.mp3", "piano-002.mp3", "piano-003.mp3"]
            : type === "drums"
                ? ["drums.mp3"]
                : type === "electricguitar"
                    ? ["guitar.mp3"]
                    : assertNever(type);
}

export const GAME_MUSIC_TYPES: MusicType[] = [
    "music",
    "piano",
    "drums",
    "electricguitar"
];

export function musicTypeToName(type: MusicType) {
    return type === "music"
        ? l.music
        : type === "piano"
            ? l.piano
            : type === "drums"
                ? l.drums
                : type === "electricguitar"
                    ? l.electricguitar
                    : assertNever(type);
}
