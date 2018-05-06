import * as React from "react";

export const MAX_STAGES = 20;
import classnames from "classnames";
import { GameSoundPlayer } from "./utils";
import l from "./lang";
import { MusicType } from "./music";

type Correctness = "right" | "wrong";
export interface GameStageProps {
    srcAudio: AudioNode;
    audioCtx: AudioContext;
    level: number;
    musicType: MusicType;
    onAnswer: (correctness: Correctness) => void;
    fxOn: boolean;
}


export interface Game {
    id: string;
    name: string;
    description: string;
    maxLevels: number;
    abInsteadOfFxOnOff?: boolean,
    eachStageFxOff?: boolean,
    stageInfo?: (props: GameStageProps) => JSX.Element,
    stage: (props: GameStageProps) => JSX.Element;
}
