import * as React from "react";

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

type FxOnOffType = "onoff" | "ab"| "originalmodified";

export interface Game {
    id: string;
    name: string;
    description: string;
    maxLevels: number;
    fxonofftype: FxOnOffType,
    eachStageFxOff?: boolean,
    levelInfo?: (levelNumber: number) => JSX.Element,
    stage: (props: GameStageProps) => JSX.Element;
}
