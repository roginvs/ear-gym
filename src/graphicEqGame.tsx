import * as React from "react";
import l from "./lang";
import { assertNever, range } from "./utils";

import { Game, GameStageProps } from "./game";

import classnames from "classnames";

import "./graphicEqGame.css";

const lvlInfoData: {
    bandsTotal: number;
    bandsAltered: number;
    dbStep: number;
}[] = [
    {
        bandsTotal: 4,
        bandsAltered: 2,
        dbStep: 6
    },
    {
        bandsTotal: 8,
        bandsAltered: 2,
        dbStep: 6
    },    
    {
        bandsTotal: 16,
        bandsAltered: 4,
        dbStep: 6
    },
    {
        bandsTotal: 16,
        bandsAltered: 6,
        dbStep: 4
    }
];

interface GraphicEqGameState {
    correctDbs: number[];
    userDbs: number[];
    userAnswered: boolean;
}

const MAX_DB = 16;

class GraphicEqGame extends React.Component<GameStageProps, GraphicEqGameState> {
    freqFullRange = this.props.musicType === "music" ||
    this.props.musicType === "drums"
        ? true
        : this.props.musicType === "piano" ||
          this.props.musicType === "electricguitar"
            ? false
            : assertNever(this.props.musicType);
    minFreq = this.freqFullRange ? 150 : 200;
    maxFreq = this.freqFullRange ? 12800 : 5000;
    lvlInfo = lvlInfoData[this.props.level - 1];
    correctDbThreshold = this.lvlInfo.dbStep;
    frequencyMultiplyStep = this.lvlInfo.bandsTotal !== 1
        ? 2 **
          (Math.log2(this.maxFreq / this.minFreq) /
              (this.lvlInfo.bandsTotal - 1))
        : 1;
    bandsFreqs = range(0, this.lvlInfo.bandsTotal).map(
        id => this.minFreq * this.frequencyMultiplyStep ** id
    );

    state = (() => {
        const correctDbs = this.bandsFreqs.map(x => 0);
        // Not a disaster if band is modified several times
        for (const i of range(0, this.lvlInfo.bandsAltered)) {
            const rndIdx = Math.floor(Math.random() * this.bandsFreqs.length);
            const rndBoost =
                (Math.random() > 0.5 ? 1 : -1) *
                (Math.floor(
                    Math.random() * Math.floor(MAX_DB / this.lvlInfo.dbStep)
                ) +
                    1) *
                this.lvlInfo.dbStep;
            correctDbs[rndIdx] = rndBoost;
        }
        const state: GraphicEqGameState = {
            correctDbs,
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
        this.fxes.forEach(
            (fx, id) =>
                id !== this.fxes.length - 1
                    ? this.fxes[id].connect(this.fxes[id + 1])
                    : this.fxes[id].connect(this.props.audioCtx.destination)
        );

        // console.info(`qtep=${this.qStep}`, this.bandsFreqs);
        this.fxes.forEach((fx, id) => {
            fx.type = "peaking";
            fx.frequency.setValueAtTime(this.bandsFreqs[id], 0);
            fx.Q.setValueAtTime(2 * Math.log2(this.frequencyMultiplyStep), 0);
            //console.info(`id=${id} freq=${freq} qStep=${qStep}`);
        });
    }

    updateFx() {
        const eqGains = this.props.fxOn
            ? this.state.userDbs
            : this.state.correctDbs;
        // console.info(eqGains);
        this.fxes.forEach((fx, id) => fx.gain.setValueAtTime(eqGains[id], 0));        
    }

    componentWillUnmount() {
        this.fxes.forEach(fx => fx.disconnect());
    }
    answered() {
        this.setState({
            userAnswered: true
        });
        const correntFreqsAmount = this.state.userDbs.filter(
            (userFreq, id) =>
                Math.abs(this.state.correctDbs[id] - userFreq) <=
                this.correctDbThreshold
        ).length;
        const totalFreqsAmount = this.state.correctDbs.length;
        this.props.onAnswer(
            correntFreqsAmount === totalFreqsAmount
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
                                key={`user-${id}`}
                                className="slider"
                                value={this.state.userDbs[id]}
                                type="range"
                                min={-MAX_DB}
                                max={MAX_DB}
                                onChange={e => {
                                    if (this.state.userAnswered) {
                                        return;
                                    }
                                    this.state.userDbs[id] = parseInt(
                                        e.target.value
                                    );
                                    this.forceUpdate();
                                    this.updateFx();
                                }}
                                onDoubleClick={() => {
                                    if (this.state.userAnswered) {
                                        return;
                                    }
                                    this.state.userDbs[id] = 0;
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
                                      key={`correct-${id}`}
                                      value={this.state.correctDbs[id]}
                                      className={classnames(
                                          "slider",
                                          "slider-answer",
                                          Math.abs(
                                              this.state.correctDbs[id] -
                                                  this.state.userDbs[id]
                                          ) <= this.correctDbThreshold
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
                                key={`bandinfo-${id}`}
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

export const GRAPHIC_EQ_GAME: Game = {
    id: "graphiceq",
    name: l.graphicEqGameName,
    description: l.graphicEqGameDescription,
    maxLevels: lvlInfoData.length,
    fxonofftype: "originalmodified",
    eachStageFxOff: true,
    // levelInfo?: (levelNumber: number) => JSX.Element,
    stage: props => <GraphicEqGame {...props} />
};
