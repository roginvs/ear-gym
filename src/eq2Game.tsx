import * as React from "react";
import l from "./lang";
import { assertNever, range } from "./utils";

import { Game, GameStageProps } from "./game";

import "./eq2game.css";

function lvlInfo(level: number) {
    const lvlInfoData: {
        bandsTotal: number;
        bandsAltered: number;
        dbStep: number;
    }[] = [
        {
            bandsTotal: 10,
            bandsAltered: 2,
            dbStep: 3
        }
    ];
    return lvlInfoData[level - 1];
}

interface EQ2GameState {
    correctDbs: number[];
    userDbs: number[];
}

const MAX_DB = 12;

class EQ2Game extends React.Component<GameStageProps, EQ2GameState> {
    bands = range(0, lvlInfo(this.props.level).bandsTotal);
    state = (() => {
        return {
            correctDbs: this.bands.map((x, id) => (id % 2 ? 0 : 6)),
            userDbs: this.bands.map(x => 0)
        };
    })();

    fxes = this.bands.map(x => this.props.audioCtx.createBiquadFilter());
    componentDidUpdate() {
        this.updateFx();
    }
    componentDidMount() {
        this.updateFx();
        const gainNode = this.props.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.8, 0);
        this.props.srcAudio.connect(gainNode);
        gainNode.connect(this.fxes[0]);
        this.fxes.map(
            (fx, id) =>
                id !== this.fxes.length - 1
                    ? this.fxes[id].connect(this.fxes[id + 1])
                    : this.fxes[id].connect(this.props.audioCtx.destination)
        );

        const minFreq = 100;
        const maxFreq = 12800;
        const max2Power = Math.log2(maxFreq / minFreq);
        const qStep = 2 ** (max2Power / this.fxes.length);
        this.fxes.map((fx, id) => {
            fx.type = "peaking";
            const freq = minFreq * qStep ** id;
            fx.frequency.setValueAtTime(freq, 0);
            fx.Q.setValueAtTime(qStep, 0); // Maybe divide by two?
            console.info(`id=${id} freq=${freq} qStep=${qStep}`);
        });
    }

    updateFx() {
        const eqGains = this.props.fxOn
            ? this.state.userDbs
            : this.state.correctDbs;
        console.info(eqGains);
        this.fxes.map((fx, id) => fx.gain.setValueAtTime(eqGains[id], 0));
    }

    componentWillUnmount() {
        this.fxes.map(fx => fx.disconnect());
    }
    render() {
        return (
            <div>
                <div className="my-1 text-center">
                    <button className="btn btn-secondary text-dark">
                        check answer
                    </button>
                </div>
                <div className="py-2">
                    <div
                        className="bg-secondary rounded mx-2"
                        style={{
                            position: "relative",
                            height: "9em"
                        }}
                    >

                    {this.bands.map((band, id) => (
                            <input
                                key={"correct-"+id}
                                value={this.state.correctDbs[id]}
                                type="range"
                                min={-MAX_DB}
                                max={MAX_DB}
                                readOnly
                                style={{
                                    position: "absolute",
                                    //top: "50%",
                                    left: `${100 *
                                        (id + 1) /
                                        (this.bands.length + 1)}%`,
                                    transformOrigin: "left top",
                                    width: "8em",                                
                                    top: "8.5em",
                                    transform:
                                        "rotate(270deg) translate(0%, -50%)"
                                }}
                            />
                        ))}

                        {this.bands.map((band, id) => (
                            <input
                                key={"user-"+id}
                                className="slider"
                                value={this.state.userDbs[id]}
                                type="range"
                                min={-MAX_DB}
                                max={MAX_DB}
                                onChange={e => {
                                    this.state.userDbs[id] = parseInt(
                                        e.target.value
                                    );
                                    this.forceUpdate();
                                    this.updateFx();
                                }}
                                style={{
                                    position: "absolute",
                                    //top: "50%",
                                    left: `${100 *
                                        (id + 1) /
                                        (this.bands.length + 1)}%`,
                                    transformOrigin: "left top",
                                    width: "8em",                                    
                                    top: "8.5em",
                                    transform:
                                        "rotate(270deg) translate(0%, -50%)"
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export const EQ2_GAME: Game = {
    id: "eq2",
    name: l.eq2game,
    description: l.eq2gamedesc,
    maxLevels: 8,
    eachStageFxOff: true,
    // levelInfo?: (levelNumber: number) => JSX.Element,
    stage: props => <EQ2Game {...props} />
};
