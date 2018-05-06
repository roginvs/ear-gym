import React from "react";
import { range, urlToAudioBuffer, GameSoundPlayer } from "./utils";
import { Loader, ErrorInfo, DivFadeinCss } from "./common";
import { MusicType, musicList } from "./music";
import { Game, MAX_STAGES } from "./game";
import classNames from "classnames";
import l from "./lang";
import classnames from "classnames";

const STAGES_COUNT = 16;
const LIVES_MAX = 3;

interface GameControllerState {
    level: number;
    stage: number;
    lives: number;
    musicCache?: AudioBuffer[];
    musicSrc?: AudioNode;
    err?: Error;
    answered?: boolean;
    fxOn: boolean;
}
export class GameController extends React.Component<
    {
        audioCtx: AudioContext;
        game: Game;
        musicType: MusicType;
        playSound: GameSoundPlayer;
        startingLevel: number;
        onReturn: () => void;
        onNewLevel: (levelNum: number) => void;
    },
    GameControllerState
> {
    state: GameControllerState = {
        level: this.props.startingLevel,
        stage: 1,
        lives: LIVES_MAX,
        musicCache: undefined,
        musicSrc: undefined,
        fxOn: false
    };
    selectMusic = () => {        
        const musicCache = this.state.musicCache;
        if (musicCache) {            
            const i = Math.floor(Math.random() * musicCache.length);
            const music = musicCache[i];
            
            const musicSrc = this.props.audioCtx.createBufferSource();
            musicSrc.buffer = music;
            musicSrc.loop = true;
            musicSrc.start(0, 0);
                        
            this.setState({
                musicSrc
            });
        } else {
            this.setState({
                musicSrc: undefined
            });
        }
    };
    startNexStage = () => {
        this.selectMusic();
        const stage = this.state.stage;
        const level = this.state.level;
        if (stage >= MAX_STAGES) {
            this.props.onNewLevel(level + 1);
            this.props.playSound("levelup");
            if (level >= this.props.game.maxLevels) {
                this.props.onReturn();
            } else {
                this.setState({
                    level: level + 1,
                    stage: 1,
                    lives: LIVES_MAX,
                    answered: false
                });
            }
        } else {
            this.setState({
                stage: stage + 1,
                answered: false
            });
        }
    };
    componentDidMount() {
        Promise.all(
            musicList(this.props.musicType)
                .map(name => `media/${this.props.musicType}/${name}`)
                .map(url => urlToAudioBuffer(this.props.audioCtx, url))
        )
            .then(musicCache =>
                this.setState(
                    {
                        musicCache
                    },
                    this.selectMusic
                )
            )
            .catch(err => this.setState({ err }));
        document.getElementsByTagName("body")[0].style.backgroundColor =
            "lightblue";

        // setInterval(() => this.forceUpdate(), 3000);
    }
    componentWillUnmount() {
        document.getElementsByTagName("body")[0].style.backgroundColor = "";
    }
    render() {
        if (this.state.err) {
            return <ErrorInfo info={this.state.err.message} />;
        }
        const musicSrc = this.state.musicSrc;
        if (!musicSrc) {
            return <Loader />;
        }

        return (
            <DivFadeinCss key="gamecontroller" className="bg-dark py-2">
                <div
                    className="row mx-2"
                    style={{
                        color: "lightgrey"
                    }}
                >
                    <div className="col-4 text-left">
                        <div>
                            <b>{this.state.level}</b>
                        </div>
                        <div>{l.level}</div>
                    </div>

                    <div className="col-4 text-center">
                        <div>
                            <b>
                                {this.state.stage} / {STAGES_COUNT}
                            </b>
                        </div>
                        <div>{l.stage}</div>
                    </div>

                    <div className="col-4 text-right">
                        <div>
                            <b>
                                {range(this.state.lives, LIVES_MAX).map(i => (
                                    <i key={i} className="fa fa-fw" />
                                ))}
                                {range(0, this.state.lives).map(i => (
                                    <i key={i} className="fa fa-user fa-fw" />
                                ))}
                            </b>
                        </div>
                        <div>{l.lives}</div>
                    </div>
                </div>

                <div key={this.state.level + "-" + this.state.stage}>
                    {this.props.game.stage({
                        srcAudio: musicSrc,
                        audioCtx: this.props.audioCtx,
                        fxOn: this.state.fxOn,
                        level: this.state.level,
                        musicType: this.props.musicType,
                        onAnswer: correctness => {
                            if (correctness === "right") {
                                this.props.playSound("correct");
                            } else {
                                const lives = this.state.lives - 1;
                                if (lives > 0) {
                                    this.props.playSound("wrong");
                                } else {
                                    this.props.playSound("gameover");
                                }
                                this.setState({
                                    lives
                                });
                            }
                            this.setState({
                                answered: true
                            });
                        }
                    })}
                </div>

                {/* this.props.game.stage({
                            level: this.state.level,
                            audioCtx: this.props.audioCtx,
                            music,
                            musicType: this.props.musicType,
                            onAnswer: correct => {
                                if (correct) {
                                    this.props.playSound("correct");
                                } else {
                                    this.props.playSound("wrong");
                                    this.setState({
                                        lives: this.state.lives - 1
                                    });
                                }

                                setTimeout(() => {
                                    if (this.state.lives === 0) {
                                        this.props.playSound("gameover");
                                        this.setState({
                                            gameOver: true
                                        });
                                    }

                                    const stage = this.state.stage;
                                    const level = this.state.level;
                                    if (stage >= MAX_STAGES) {
                                        this.props.onNewLevel(level + 1);
                                        this.props.playSound('levelup');
                                        if (
                                            level >= this.props.game.maxLevels
                                        ) {
                                            this.props.onReturn();
                                        } else {
                                            this.setState({
                                                level: level + 1,
                                                stage: 1,
                                                lives: LIVES_MAX
                                            });
                                        }
                                    } else {
                                        this.setState({
                                            stage: stage + 1
                                        });
                                    }
                                }, 3000);
                            },
                            onExit: () => {
                                this.props.onReturn();
                            }
                        })}
                    </div> */}

                <div className="row no-gutters mx-2">
                    <div className="col-12">
                        <div className="text-center">
                            <button
                                onClick={() => this.setState({ fxOn: false })}
                                className={classnames("btn btn-secondary m-1", {
                                    "text-dark": this.state.fxOn
                                })}
                            >
                            {this.props.game.abInsteadOfFxOnOff ? <>
                                <i className="fa fa-fw fa-volume-up" />{" "}
                                {l.fxSoundA}
                                </> : <>
                                <i className="fa fa-fw fa-square-o" />{" "}
                                {l.fxoff}
                                </>}
                            </button>

                            <button
                                onClick={() => this.setState({ fxOn: true })}
                                className={classnames("btn btn-secondary m-1", {
                                    "text-dark": !this.state.fxOn
                                })}
                            >
                            {this.props.game.abInsteadOfFxOnOff ? <>
                                <i className="fa fa-fw fa-volume-up" />{" "}
                                {l.fxSoundB}
                                </> : <>
                                <i className="fa fa-fw fa-check-square-o" />
                                {l.fxon}
                                </>}
                            </button>                  
                        </div>
                    </div>

                    <div className="col-8 offset-2 text-center">
                        {this.state.answered ? (
                            <DivFadeinCss>
                                <button
                                    onClick={() => {
                                        if (this.state.lives > 0) {
                                            this.startNexStage();
                                        } else {
                                            this.selectMusic();
                                            this.setState(
                                                {
                                                    answered: false,
                                                    lives: LIVES_MAX,
                                                    stage: 1
                                                },                                                
                                            );
                                        }
                                    }}
                                    className={classNames(
                                        "btn btn-secondary m-1 text-dark"
                                    )}
                                >
                                    {this.state.lives > 0 ? (
                                        <span>
                                            <i className="fa fa-mail-forward" />{" "}
                                            {l.startNextStage}
                                        </span>
                                    ) : (
                                        <span>
                                            <i className="fa fa-repeat" />{" "}
                                            {l.startAgain}
                                        </span>
                                    )}
                                </button>
                            </DivFadeinCss>
                        ) : null}
                    </div>
                    <div className="col-2 text-right">
                        <button
                            onClick={() => this.props.onReturn()}
                            className={classnames(
                                "btn btn-secondary m-1 text-dark"
                            )}
                        >
                            <i className={classnames("fa fa-fw fa-sign-out")} />
                        </button>
                    </div>
                </div>
            </DivFadeinCss>
        );
    }
}
