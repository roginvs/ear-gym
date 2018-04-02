export type GameSound = 'correct' | 'wrong' | 'gameover';
export type GameSoundPlayer = (sound: GameSound) => void

export function urlToAudioBuffer(audioCtx: AudioContext, url: string) {
    return fetch(url)
    .then(x => x.arrayBuffer())
    .then(data => audioCtx.decodeAudioData(data))
};


export function gameSound(audioCtx: AudioContext, type: GameSound) {
    return urlToAudioBuffer(audioCtx, `media/${type}.mp3`)
}





export function range(start: number, stop: number) {
    let r:number[] = [];
    if (stop <= start) {
        return r
    } 
    for (let i = start; i < stop; i ++) {
        r.push(i)
    }

    return r;
}

export function assertNever(x: never): never {
    throw new Error("Unexpected: " + x);
}
