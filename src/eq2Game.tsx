import * as React from "react";
import l from "./lang";
import { assertNever, range } from "./utils";

import { Game, GameStageProps } from "./game";

import classnames from "classnames";

import "./eq2game.css";

function lvlInfo(level: number) {
    const lvlInfoData: {
        bandsTotal: number;
        bandsAltered: number;
        dbStep: number;
    }[] = [
        {
            bandsTotal: 4, // 20
            bandsAltered: 2,
            dbStep: 3
        }
    ];
    return lvlInfoData[level - 1];
}

interface EQ2GameState {
    correctDbs: number[];
    userDbs: number[];
    userAnswered: boolean;
}

const MAX_DB = 12;
const CORRECT_THRESHOLD = 4;

class EQ2Game extends React.Component<GameStageProps, EQ2GameState> {
    minFreq = 150;
    maxFreq = 12800;
    lvlInfo = lvlInfo(this.props.level);
    qStep = 2 **
    (Math.log2(this.maxFreq / this.minFreq) / this.lvlInfo.bandsTotal);
    bandsFreqs = range(0, lvlInfo(this.props.level).bandsTotal).map(
        id => this.minFreq * this.qStep ** id
    );

    state = (() => {
        const state: EQ2GameState = {
            correctDbs: this.bandsFreqs.map((x, id) => (id % 2 ? 0 : 6)),
            userDbs: this.bandsFreqs.map(x => 0),
            userAnswered: false
        };
        return state;
    })();

    fxes = this.bandsFreqs.map(x => this.props.audioCtx.createBiquadFilter());
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

        this.fxes.map((fx, id) => {
            fx.type = "peaking";
            fx.frequency.setValueAtTime(this.bandsFreqs[id], 0);
            fx.Q.setValueAtTime(this.qStep, 0); // Maybe divide by two?
            //console.info(`id=${id} freq=${freq} qStep=${qStep}`);
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
    answered() {
        this.setState({
            userAnswered: true
        });
        const correntFreqsAmount = this.state.userDbs.filter(
            (userFreq, id) =>
                Math.abs(this.state.correctDbs[id] - userFreq) <=
                CORRECT_THRESHOLD
        ).length;
        this.props.onAnswer(
            correntFreqsAmount === this.state.correctDbs.length
                ? "right"
                : "wrong"
        );
    }
    render() {
        return (
            <div>
                <div className="my-1 text-center">
                    <button
                        className="btn btn-secondary text-dark"
                        onClick={() => this.answered()}
                    >
                        <i className="fa fa-balance-scale" /> {l.soundTheSame}
                    </button>
                </div>
                <div className="py-2">
                    <div
                        className="bg-secondary rounded mx-2"
                        style={{
                            position: "relative",
                            height: "14em"
                        }}
                    >
                        

                        {this.bandsFreqs.map((band, id) => (
                            <input
                                key={"user-" + id}
                                className="slider"
                                value={this.state.userDbs[id]}
                                type="range"
                                min={-MAX_DB}
                                max={MAX_DB}
                                onChange={e => {
                                    if (this.state.userAnswered) {
                                        return
                                    }
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
                                        (this.bandsFreqs.length + 1)}%`,
                                    transformOrigin: "left top",
                                    width: "10em",
                                    top: "10.5em",
                                    transform:
                                        "rotate(270deg) translate(0%, -50%)"
                                }}
                            />
                        ))}

                        {this.state.userAnswered
                            ? this.bandsFreqs.map((band, id) => (
                                  <input
                                      key={"correct-" + id}
                                      value={this.state.correctDbs[id]}
                                      className={classnames(
                                          "slider",
                                          "slider-answer",
                                          Math.abs(
                                              this.state.correctDbs[id] -
                                                  this.state.userDbs[id]
                                          ) <= CORRECT_THRESHOLD
                                              ? "slider-answer-correct"
                                              : "slider-answer-wrong"
                                      )}
                                      type="range"
                                      min={-MAX_DB}
                                      max={MAX_DB}
                                      readOnly
                                      style={{
                                          position: "absolute",
                                          //top: "50%",
                                          left: `${100 *
                                              (id + 1) /
                                              (this.bandsFreqs.length + 1)}%`,
                                          transformOrigin: "left top",
                                          width: "10em",
                                          top: "10.5em",
                                          transform:
                                              "rotate(270deg) translate(0%, -50%)"
                                      }}
                                  />
                              ))
                            : null}

                        {this.bandsFreqs.map((band, id) => (
                            <span
                                key={"bandinfo-" + id}
                                style={{
                                    position: "absolute",
                                    left: `${100 *
                                        (id + 1) /
                                        (this.bandsFreqs.length + 1)}%`,
                                    top: id % 2 ? "10.5em" : "11.5em",
                                    transform: "translate(-50%, 0%)",
                                    color: "lightgrey"
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "0.7em"
                                    }}
                                >
                                    {Math.round(band)}
                                    {l.hz}
                                </span>
                            </span>
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
    fxonofftype: "originalmodified",
    eachStageFxOff: true,
    // levelInfo?: (levelNumber: number) => JSX.Element,
    stage: props => <EQ2Game {...props} />
};
