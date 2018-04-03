import React from "react";
import { range, urlToAudioBuffer, GameSoundPlayer } from "./utils";
import { Loader } from "./common";
import { MusicType, musicList } from "./music";
import { Game, MAX_STAGES } from "./game";
import classNames from "classnames";

interface GameControllerState {
    level: number;
    stage: number;
    lives: number;
    music?: AudioBuffer[];
}

const STAGES_COUNT = 20;

export class GameController extends React.Component<
    {
        audioCtx: AudioContext;
        game: Game;
        musicType: MusicType;
        playSound: GameSoundPlayer;
        onReturn: (maxLevelAchieved: number) => void;
    },
    GameControllerState
> {
    state: GameControllerState = {
        level: 1,
        stage: 1,
        lives: 5,
        music: undefined
    };
    componentDidMount() {
        Promise.all(
            musicList(this.props.musicType)
                .map(name => `media/${this.props.musicType}/${name}`)
                .map(url => urlToAudioBuffer(this.props.audioCtx, url))
        ).then(music => this.setState({ music }));
        document.getElementsByTagName('body')[0].style.backgroundColor = 'lightblue';
    }
    componentWillUnmount() {
        document.getElementsByTagName('body')[0].style.backgroundColor = '';
    }
    render() {
        const music = this.state.music;
        if (!music) {
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
                        <div>Level</div>
                    </div>

                    <div className="col-4 text-center">
                        <div>
                            <b>
                                {this.state.stage} / {STAGES_COUNT}
                            </b>
                        </div>
                        <div>Stage</div>
                    </div>

                    <div className="col-4 text-right">
                        <div>
                            <b>
                                {range(0, this.state.lives).map(i => (
                                    <i key={i} className="fa fa-user fa-fw" />
                                ))}
                            </b>
                        </div>
                        <div>Lives</div>
                    </div>
                </div>
                {this.state.lives > 0 ? (
                    <div key={this.state.level + "-" + this.state.stage}>
                        {this.props.game.stageRender({
                            level: this.state.level,
                            audioCtx: this.props.audioCtx,
                            playSound: this.props.playSound,
                            music,
                            onReturn: result => {
                                if (result === undefined) {
                                    this.props.onReturn(this.state.level);
                                    return;
                                }
                                if (!result) {
                                    this.setState(
                                        {
                                            lives: this.state.lives - 1
                                        },
                                        () => {
                                            if (this.state.lives === 0) {
                                                this.props.playSound(
                                                    "gameover"
                                                );
                                            }
                                        }
                                    );
                                }
                                const stage = this.state.stage;
                                const level = this.state.level;
                                if (stage >= MAX_STAGES) {
                                    if (level >= this.props.game.maxLevels) {
                                        this.props.onReturn(level + 1);
                                    } else {
                                        this.setState({
                                            level: level + 1,
                                            stage: 1
                                        });
                                    }
                                } else {
                                    this.setState({
                                        stage: stage + 1
                                    });
                                }
                            }
                        })}
                    </div>
                ) : (
                    <div className="text-center">
                        <button
                            onClick={() =>
                                this.props.onReturn(this.state.level)
                            }
                            className={classNames("btn btn-secondary mx-1")}
                        >
                            Game over
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
