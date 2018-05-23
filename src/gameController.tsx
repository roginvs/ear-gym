import React from "react";
import { range, urlToAudioBuffer, GameSoundPlayer, assertNever } from "./utils";
import { Loader, ErrorInfo, DivFadeinCss } from "./common";
import { MusicType, musicList } from "./music";
import { Game } from "./game";
import classNames from "classnames";
import l from "./lang";
import classnames from "classnames";

const STAGES_COUNT = 20;
const LIVES_MAX = 3;

interface GameControllerState {
    level: number;
    stage: number;
    lives: number;
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
    urlToaudioBufferCache: {
        [id: string]: AudioBuffer | undefined;
    } = {};
    state: GameControllerState = {
        level: this.props.startingLevel,
        stage: 1,
        lives: LIVES_MAX,
        musicSrc: undefined,
        fxOn: false
    };

    selectMusic = () => {
        const setMusicSrcFromAudioBuffer = (music: AudioBuffer) => {
            const musicSrc = this.props.audioCtx.createBufferSource();
            musicSrc.buffer = music;
            musicSrc.loop = true;
            musicSrc.start(0, 0);
            this.setState({
                musicSrc
            });
        };
        const musicUrlList = musicList(this.props.musicType).map(
            name => `media/${this.props.musicType}/${name}`
        );

        const i = Math.floor(Math.random() * musicUrlList.length);
        const musicUrl = musicUrlList[i];
        const alreadyCachedMusicSrc = this.urlToaudioBufferCache[musicUrl];
        if (alreadyCachedMusicSrc) {
            setMusicSrcFromAudioBuffer(alreadyCachedMusicSrc);
        } else {
            this.setState({
                musicSrc: undefined
            });
            urlToAudioBuffer(this.props.audioCtx, musicUrl).then(
                downloadedAudioBuffer => {
                    this.urlToaudioBufferCache[
                        musicUrl
                    ] = downloadedAudioBuffer;
                    setMusicSrcFromAudioBuffer(downloadedAudioBuffer);
                }
            );
        }
    };
    startNexStage = () => {
        this.selectMusic();
        const stage = this.state.stage;
        const level = this.state.level;
        if (stage >= STAGES_COUNT) {
            this.props.onNewLevel(level + 1);
            this.props.playSound("levelup");
            if (level >= this.props.game.maxLevels) {
                this.props.onReturn();
            } else {
                this.setState({
                    level: level + 1,
                    stage: 1,
                    lives: LIVES_MAX,
                    answered: false,
                    fxOn: this.props.game.eachStageFxOff
                        ? false
                        : this.state.fxOn
                });
            }
        } else {
            this.setState({
                stage: stage + 1,
                answered: false,
                fxOn: this.props.game.eachStageFxOff ? false : this.state.fxOn
            });
        }
    };
    componentDidMount() {
        document.getElementsByTagName("body")[0].style.backgroundColor =
            "lightblue";
        this.selectMusic();
    }
    componentWillUnmount() {
        document.getElementsByTagName("body")[0].style.backgroundColor = "";
    }
    render() {
        if (this.state.err) {
            return <ErrorInfo info={this.state.err.message} />;
        }

        const musicSrc = this.state.musicSrc;

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
                            {this.props.game.levelInfo ? (
                                <span>
                                    {" "}
                                    (
                                    {this.props.game.levelInfo(
                                        this.state.level
                                    )})
                                </span>
                            ) : null}
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

                {musicSrc ? (
                    <DivFadeinCss
                        key={this.state.level + "-" + this.state.stage}
                    >
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
                        })}{" "}
                    </DivFadeinCss>
                ) : (
                    <DivFadeinCss key="loader" className="text-center py-2">
                        <div
                            style={{
                                color: "lightgrey",
                                height: "8em",
                                lineHeight: "8em"
                            }}
                        >
                            <Loader />
                        </div>
                    </DivFadeinCss>
                )}

                <div className="row no-gutters mx-2">
                    <div className="col-12">
                        <div className="text-center">
                            <button
                                onClick={() => this.setState({ fxOn: false })}
                                className={classnames("btn btn-secondary m-1", {
                                    "text-dark": this.state.fxOn
                                })}
                            >
                                {this.props.game.fxonofftype === "onoff" ? (
                                    <>
                                        <i className="fa fa-fw fa-square-o" />{" "}
                                        {l.fxoff}
                                    </>
                                ) : this.props.game.fxonofftype === "ab" ? (
                                    <>
                                        <i className="fa fa-fw fa-volume-up" />{" "}
                                        {l.fxSoundA}
                                    </>
                                ) : this.props.game.fxonofftype ===
                                "originalmodified" ? (
                                    <>
                                        <i className="fa fa-fw fa-square-o" />{" "}
                                        {l.fxSoundOriginal}
                                    </>
                                ) : (
                                    assertNever(this.props.game.fxonofftype)
                                )}
                            </button>

                            <button
                                onClick={() => this.setState({ fxOn: true })}
                                className={classnames("btn btn-secondary m-1", {
                                    "text-dark": !this.state.fxOn
                                })}
                            >
                                {this.props.game.fxonofftype === "onoff" ? (
                                    <>
                                        <i className="fa fa-fw fa-check-square-o" />
                                        {l.fxon}
                                    </>
                                ) : this.props.game.fxonofftype === "ab" ? (
                                    <>
                                        <i className="fa fa-fw fa-volume-up" />{" "}
                                        {l.fxSoundB}
                                    </>
                                ) : this.props.game.fxonofftype ===
                                "originalmodified" ? (
                                    <>
                                        <i className="fa fa-fw fa-check-square-o" />
                                        {l.fxSoundModified}
                                    </>
                                ) : (
                                    assertNever(this.props.game.fxonofftype)
                                )}
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
                                            this.setState({
                                                answered: false,
                                                lives: LIVES_MAX,
                                                stage: 1
                                            });
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
