import * as React from "react";
import l from "./lang";

import { GameStageProps, Game } from "./game";
import { assertNever, range } from "./utils";
import classnames from "classnames";
import { GameSelectorChoice } from "./gameSelectorChoice";

const NO_SATURATION = {
    saturationRadio: 0
};

const LEVELS = [
    {
        A: {
            saturationRadio: 1
        },
        B: NO_SATURATION
    },
    {
        A: {
            saturationRadio: 0.6
        },
        B: NO_SATURATION
    },
    {
        A: {
            saturationRadio: 1
        },
        B: {
            saturationRadio: 0.3
        }
    },
    {
        A: {
            saturationRadio: 1
        },
        B: {
            saturationRadio: 0.6
        }
    }
];

interface GameState {
    correctId: 0 | 1;
    saturatedBoost: number;
    answeredId?: 0 | 1;
}

const USE_COMPRESSOR = true;

class DistortionStage extends React.Component<GameStageProps, GameState> {
    fx: WaveShaperNode = this.props.audioCtx.createWaveShaper();
    fxCompressorPre: DynamicsCompressorNode = this.props.audioCtx.createDynamicsCompressor();
    fxCompressorAfter: DynamicsCompressorNode = this.props.audioCtx.createDynamicsCompressor();

    componentDidUpdate() {
        this.updateFx();
    }

    debugIntervalTimer: number = 0;
    componentDidMount() {
        this.updateFx();
        if (USE_COMPRESSOR) {
            // Why that values? Why -20 db? It is really very big. Ratio is huge too. But it works
            this.fxCompressorAfter.threshold.setValueAtTime(-20, 0);
            this.fxCompressorAfter.knee.setValueAtTime(1, 0);
            this.fxCompressorAfter.ratio.setValueAtTime(20, 0);
            this.fxCompressorAfter.attack.setValueAtTime(0, 0);
            this.fxCompressorAfter.release.setValueAtTime(0.25, 0);

            this.fxCompressorPre.threshold.setValueAtTime(-20, 0);
            this.fxCompressorPre.knee.setValueAtTime(1, 0);
            this.fxCompressorPre.ratio.setValueAtTime(20, 0);
            this.fxCompressorPre.attack.setValueAtTime(0, 0);
            this.fxCompressorPre.release.setValueAtTime(0.25, 0);

            
            this.props.srcAudio.connect(this.fxCompressorPre);
            this.fxCompressorPre.connect(this.fx);
            this.fx.connect(this.fxCompressorAfter);
            this.fxCompressorAfter.connect(this.props.audioCtx.destination);

            this.debugIntervalTimer = window.setInterval(() => {
                // console.info(`Comp reduction pre=${this.fxCompressorPre.reduction} after=${this.fxCompressorAfter.reduction}`)
            }, 100)
        } else {
            this.props.srcAudio.connect(this.fx);
            this.fx.connect(this.props.audioCtx.destination);
        }
        // this.fx.oversample
    }

    state: GameState = {
        correctId: Math.random() > 0.5 ? 0 : 1,
        saturatedBoost: USE_COMPRESSOR ? 1 : 0.2 + Math.random() / 2
    };

    updateFx() {
        const useAorB = this.props.fxOn
            ? this.state.correctId
            : !this.state.correctId;

        const levelInfo = LEVELS[this.props.level - 1];

        const saturationParams = useAorB ? levelInfo.A : levelInfo.B;

        const ITEMS = 50;
        const saturationBoost = useAorB ? this.state.saturatedBoost : 1;
        const positiveCurve = range(1, ITEMS + 1).map(
            i =>
                saturation(
                    saturationParams.saturationRadio,
                    saturation(saturationParams.saturationRadio, i / ITEMS)
                ) * saturationBoost
        );

        const curve: number[] = [
            ...positiveCurve.map(x => -x).reverse(),
            0,
            ...positiveCurve
        ];

        /*
        console.info(curve);
        console.info(
            `corr=${this.state.correctId} useAorB=${useAorB} ` +
                `ratio=${
                    saturationParams.saturationRadio
                } saturationBoost=${saturationBoost} USE_COMPRESSOR=${USE_COMPRESSOR}`
        );
        */

        this.fx.curve = new Float32Array(curve);
    }

    componentWillUnmount() {
        this.fx.disconnect();
        if (USE_COMPRESSOR) {
            this.fxCompressorPre.disconnect();
            this.fxCompressorAfter.disconnect();
            clearInterval(this.debugIntervalTimer);
        }
    }

    render() {
        return (
            <div>
                <GameSelectorChoice
                    names={[l.saturationChoiceA, l.saturationChoiceB]}
                    correctId={
                        this.state.answeredId !== undefined
                            ? this.state.correctId
                            : undefined
                    }
                    onAnswer={answeredId => {
                        const correctId = this.state.correctId;
                        if (correctId === undefined) {
                            return;
                        }
                        this.setState({
                            answeredId: answeredId as 0 | 1
                        });

                        const correct = answeredId === correctId;
                        console.info(
                            `level=${this.props.level} ` +
                                `answered=${answeredId} correct=${correctId} ` +
                                `correct=${correct}`
                        );

                        this.props.onAnswer(correct ? "right" : "wrong");
                    }}
                />
            </div>
        );
    }
}

export const SATURATION_GAME: Game = {
    id: "saturation",
    name: l.saturation,
    description: l.saturationDesc,
    maxLevels: LEVELS.length,
    abInsteadOfFxOnOff: true,
    stage: props => <DistortionStage {...props} />
};

function saturation(saturationAmount: number, x: number) {
    if (saturationAmount) {
        const foo = saturationAmount / 2 * Math.PI;
        const bar = Math.sin(saturationAmount / 2 * Math.PI);
        return Math.sin(x * foo) / bar;
    } else {
        return x;
    }
}
