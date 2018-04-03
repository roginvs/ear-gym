import React from "react";
import { range, urlToAudioBuffer, GameSoundPlayer } from "./utils";
import { Loader, ErrorInfo } from "./common";
import { MusicType, musicList } from "./music";
import { Game, MAX_STAGES } from "./game";
import classNames from "classnames";
import l from "./lang";

interface GameControllerState {
    level: number;
    stage: number;
    lives: number;
    music?: AudioBuffer[];
    err?: Error;
    gameOver?: boolean    
}

const STAGES_COUNT = 20;
const LIVES_MAX = 3;
export class GameController extends React.Component<
    {
        audioCtx: AudioContext;
        game: Game;
        musicType: MusicType;
        playSound: GameSoundPlayer;
        startLevel: number;
        onReturn: () => void;
        onNewLevel: (levelNum: number) => void;
    },
    GameControllerState
> {
    state: GameControllerState = {
        level: this.props.startLevel,
        stage: 1,
        lives: LIVES_MAX,
        music: undefined
    };
    componentDidMount() {
        Promise.all(
            musicList(this.props.musicType)
                .map(name => `media/${this.props.musicType}/${name}`)
                .map(url => urlToAudioBuffer(this.props.audioCtx, url))
        ).then(music => this.setState({ music }))
        .catch(err => this.setState({err}))
        document.getElementsByTagName('body')[0].style.backgroundColor = 'lightblue';
    }
    componentWillUnmount() {
        document.getElementsByTagName('body')[0].style.backgroundColor = '';
    }
    render() {
        if (this.state.err) {
            return <ErrorInfo info={this.state.err.message}/>
        }
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
                {! this.state.gameOver ? (
                    <div key={this.state.level + "-" + this.state.stage}>
                        {this.props.game.stageRender({
                            level: this.state.level,
                            audioCtx: this.props.audioCtx,                            
                            music,
                            musicType: this.props.musicType,
                            onAnswer: correct => {
                                if (correct) {
                                    this.props.playSound('correct')
                                } else {
                                        this.props.playSound('wrong');
                                        this.setState(
                                            {
                                                lives: this.state.lives - 1
                                            });                                                                                    
                                } 
                            },
                            onReturn: () => {  
                                
                                    if (this.state.lives === 0) {
                                        this.props.playSound(
                                            "gameover"
                                        );
                                        this.setState({
                                            gameOver: true
                                        })
                                    }
                                                                              
                                const stage = this.state.stage;
                                const level = this.state.level;
                                if (stage >= MAX_STAGES) {
                                    this.props.onNewLevel(level + 1);
                                    if (level >= this.props.game.maxLevels) {                                        
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
                            }
                        })}
                    </div>
                ) : (
                    <div className="text-center">
                        <button
                            onClick={() =>
                                this.props.onReturn()
                            }
                            className={classNames("btn btn-secondary mx-1")}
                        >
                            {l.gameOver}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
