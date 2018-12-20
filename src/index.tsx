// import "./monkeyLogs";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Loader, DivFadeinCss } from "./common";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";

import {gameSound, GameSoundPlayer} from './utils';
import {GameRoot} from './gameRoot';
import { GameRootNoWebaudio } from "./gameRootNoWebaudio";

const root = document.getElementById("root");

declare global {
    interface Window { 
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
     }
}
(async () => {
    if (document.location.hostname !== "localhost" && 
        document.location.origin.slice(0, 7) === 'http://') { 
        console.info('Redirecting to https');
        document.location.href = document.location.href.replace('http://', 'https://'); 
        return
    }
    
    console.info(`Creating context`);    
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
        console.warn(`AudioContext is not supported on this browser`)        
        ReactDOM.render(<GameRootNoWebaudio/>, root);
        return;        
    }
    const audioCtx = new AudioCtx();

    console.info(`Loading data`);
    const [correct, wrong, gameover, levelup, silenceIosWorkaround] = await Promise.all([
        gameSound(audioCtx, "correct"),
        gameSound(audioCtx, "wrong"),
        gameSound(audioCtx, "gameover"),
        gameSound(audioCtx, "levelup"),
        gameSound(audioCtx, "silenceIosWorkaround")
    ]);
    const gameSounds = {
        correct,
        wrong,
        gameover,
        levelup,
        silenceIosWorkaround
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
})().catch((e: Error) => {
    console.error(`Catched ${e} ${e.message}`);
    ReactDOM.render(
        <div className="container">
            <div className="py-5">
                Ошибка {e.name} {e.message} {e.stack}
            </div>
        </div>,
        root
    );
});
