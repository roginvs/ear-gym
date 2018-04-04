import React from "react";
import { range, urlToAudioBuffer, GameSoundPlayer } from "./utils";
import { Loader, ErrorInfo } from "./common";
import { MusicType, musicList } from "./music";
import { Game, MAX_STAGES } from "./game";
import classNames from "classnames";
import l from "./lang";
import classnames from "classnames";



const STAGES_COUNT = 20;
const LIVES_MAX = 3;


class FxOnOffButton extends React.Component<
    {
        active: boolean;
        type: "on" | "off";
        onClick: () => void;
    },
    {}
> {
    render() {
        return (
            <button
                onClick={this.props.onClick}
                className={classnames("btn btn-secondary mx-1", {
                    "text-dark": this.props.active
                })}
            >
                <i
                    className={classnames("fa fa-fw", {
                        "fa-check-square-o": this.props.type === "on",
                        "fa-square-o": this.props.type === "off"
                    })}
                />
                {this.props.type === "on" ? (
                    <span>{l.fxon}</span>
                ) : (
                    <span>{l.fxoff}</span>
                )}
            </button>
        );
    }
}

class ExitButton extends React.Component<
    {
        onClick: () => void;
    },
    {}
> {
    render() {
        return (
            <button
                onClick={this.props.onClick}
                className={classnames("btn btn-secondary")}
            >
                <i className={classnames("fa fa-fw fa-sign-out")} />
            </button>
        );
    }
}
class GameBottom extends React.Component<
    {
        fxActive: boolean;
        toggleFx: (newVal: boolean) => void;
        onExit: () => void;
    },
    {}
> {
    render() {
        return (
            <div className="row no-gutters mx-2">
                <div className="col-8 offset-2">
                    <div className="text-center">
                        <FxOnOffButton
                            active={this.props.fxActive}
                            type="off"
                            onClick={() => this.props.toggleFx(false)}
                        />

                        <FxOnOffButton
                            active={!this.props.fxActive}
                            type="on"
                            onClick={() => this.props.toggleFx(true)}
                        />
                    </div>
                </div>
                <div className="col-2 text-right">
                
                    <ExitButton onClick={this.props.onExit} />
                    </div>
                
            </div>
        );
    }
}


interface GameControllerState {
    level: number;
    stage: number;
    lives: number;
    musicCache?: AudioBuffer[];
    musicSrc?: AudioBufferSourceNode,
    err?: Error;
    gameOver?: boolean;
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
        fxOn: false,
    };
    updateMusic = () => {
        const musicCache = this.state.musicCache;
        if (musicCache) {
            const musicSrc = this.props.audioCtx.createBufferSource();
            const i = Math.floor(Math.random() * musicCache.length);
            const music = musicCache[i];
            musicSrc.buffer = music;            
            musicSrc.loop = true;
            musicSrc.start(0, 0);
            this.setState({
                musicSrc
            })
        } else {
            this.setState({
                musicSrc: undefined
            })
        }
    }
    componentDidMount() {
        Promise.all(
            musicList(this.props.musicType)
                .map(name => `media/${this.props.musicType}/${name}`)
                .map(url => urlToAudioBuffer(this.props.audioCtx, url))
        )
            .then(musicCache => this.setState({ 
                musicCache,                
            }, this.updateMusic))
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
            <div className="bg-dark py-2">
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
                {!this.state.gameOver ? (
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
                                this.props.playSound("wrong");
                                this.setState({
                                    lives: this.state.lives - 1
                                });
                            }
                        }

                        })}
                        </div>
                    
                    
                        /* this.props.game.stage({
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
                    </div> */
                ) : (
                    <div className="text-center">
                        <div
                            className="my-4"
                            style={{
                                color: "lightgrey"
                            }}
                        >
                            <h5>{l.gameOver}</h5>
                        </div>
                        <div className="mb-2">
                            <button
                                onClick={() =>
                                    this.setState({
                                        gameOver: false,
                                        lives: LIVES_MAX,
                                        stage: 1
                                    })
                                }
                                className={classNames("btn btn-secondary mx-1")}
                            >
                                <i className="fa fa-repeat" /> {l.startAgain}
                            </button>
                        </div>
                        <div className="mb-2">
                            <button
                                onClick={() => this.props.onReturn()}
                                className={classNames("btn btn-secondary mx-1")}
                            >
                                <i className="fa fa-sign-out" /> {l.exit}
                            </button>
                        </div>                        
                    </div>
                )}

                <GameBottom
                fxActive={this.state.fxOn}
                toggleFx={fxOn => this.setState({fxOn})}
                onExit={() => this.props.onReturn()}
                />
            </div>
        );
    }
}
