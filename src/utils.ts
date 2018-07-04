export type GameSound = 'correct' | 'wrong' | 'gameover' | 'levelup' | 'silenceIosWorkaround';
export type GameSoundPlayer = (sound: GameSound) => void

export async function urlToAudioBuffer(audioCtx: AudioContext, url: string) {    
    const f = await fetch(url);
    const arrBuff = await f.arrayBuffer();
    const data = await new Promise<AudioBuffer>((resolv, reject) => audioCtx.decodeAudioData(arrBuff, resolv, reject));
    return data
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
    throw new Error(`Unexpected: ${x}`);
}
