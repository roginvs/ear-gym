import * as React from "react";
import * as ReactDOM from "react-dom";
import { Loader, DivFadeinCss } from "./common";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";

import {gameSound, GameSoundPlayer} from './utils';
import {GameRoot} from './gameRoot';

const root = document.getElementById("root");

declare global {
    interface Window { 
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
     }
}
(async () => {
    console.info(`Creating context`);    
    const AudioCtx = window.AudioContext || window.webkitAudioContext || AudioContext;
    if (!AudioCtx) {
        throw new Error(`AudioContext is not supported on this browser`)
    }
    const audioCtx = new AudioCtx();

    console.info(`Loading data`);
    const [correct, wrong, gameover, levelup] = await Promise.all([
        gameSound(audioCtx, "correct"),
        gameSound(audioCtx, "wrong"),
        gameSound(audioCtx, "gameover"),
        gameSound(audioCtx, "levelup")
    ]);
    const gameSounds = {
        correct,
        wrong,
        gameover,
        levelup
    };
    const playSound: GameSoundPlayer = type => {
        const source = audioCtx.createBufferSource();
        source.buffer = gameSounds[type];

        source.connect(audioCtx.destination);
        source.start();
        source.onended = () => source.disconnect();
    };

    ReactDOM.render(
        <GameRoot 
            audioCtx={audioCtx}
            playSound={playSound}/>,
        root
    );
})().catch(e => {
    console.info('catch');
    ReactDOM.render(
        <div className="container">
            <div className="py-5">
                Ошибка {e.message}
            </div>
        </div>,
        root
    );
});
