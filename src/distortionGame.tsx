import * as React from "react";
import l from "./lang";

import { GameStageProps, Game } from "./game";
import { assertNever, range } from "./utils";
import classnames from "classnames";
import { GameSelectorChoice } from "./gameSelectorChoice";

interface GameState {
    correctId: number;
    answeredId?: number;
}

class DistortionStage extends React.Component<GameStageProps, GameState> {
    fx: WaveShaperNode = this.props.audioCtx.createWaveShaper();

    componentDidUpdate() {
        this.updateFx();
    }
    componentDidMount() {
        this.updateFx();
        this.props.srcAudio.connect(this.fx);
        this.fx.connect(this.props.audioCtx.destination);
        // this.fx.oversample
    }

    state: GameState = {
        correctId: Math.random() > 0.5 ? 0 : 1
    };

    updateFx() {
        const fxOn = this.props.fxOn
            ? this.state.correctId
            : !this.state.correctId;
   
        const slider1 = fxOn ? 0.6 : 0;
        const f = (x: number) => {
            if (slider1) {
                const foo = slider1 / 2 * Math.PI;
                const bar = Math.sin(slider1 / 2 * Math.PI);
                return Math.sin(x*foo)/bar
            } else {
                return x
            }
        }

        const ITEMS = 50;
        const positiveCurve = range(1, ITEMS + 1).map(i => f(i/ITEMS));
        

        const curve: number[] = [...(positiveCurve.map(x => -x).reverse()), 0, ...positiveCurve];

        console.info(curve);

        this.fx.curve = new Float32Array(curve);
    }

    componentWillUnmount() {
        this.fx.disconnect();
    }

    render() {
        return (
            <div>
                <GameSelectorChoice
                    names={[
                        "Sample A is more distorted",
                        "Sample B is more distorted"
                    ]}
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
                            answeredId
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

export const DISTORTION_GAME: Game = {
    id: "distortion",
    name: l.gain,
    description: l.gaindesc,
    maxLevels: 8,
    abInsteadOfFxOnOff: true,
    stage: props => <DistortionStage {...props} />
};
