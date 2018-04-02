import * as React from "react";
import * as ReactDOM from "react-dom";
import { Loader, DivFadeinCss } from "./common";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";

import {gameSound, GameSoundPlayer} from './utils';
import {GameRoot} from './gameRoot';

const root = document.getElementById("root");

(async () => {
    console.info(`Creating context`);
    const audioCtx = new AudioContext();

    console.info(`Loading data`);
    const [correct, wrong, gameover] = await Promise.all([
        gameSound(audioCtx, "correct"),
        gameSound(audioCtx, "wrong"),
        gameSound(audioCtx, "gameover")
    ]);
    const gameSounds = {
        correct,
        wrong,
        gameover
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
    ReactDOM.render(
        <div className="container">
            <div className="py-5">
                Ошибка {e} ({e.message})
            </div>
        </div>,
        root
    );
});
