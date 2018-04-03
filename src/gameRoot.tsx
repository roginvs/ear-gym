import * as React from "react";
import { Game } from "./game";
import { GameController } from "./gameController";
import { MusicType, GAME_MUSIC_TYPES, musicTypeToName } from "./music";
import { EQ_GAME_PLUS, EQ_GAME_MINUS } from "./eqGame";
import { DivFadeinCss } from "./common";
import { range, GameSoundPlayer } from "./utils";
import classnames from "classnames";
import l from "./lang";
import { GAIN_GAME } from "./gainGame";
// import {Collapse} from "reactstrap";

const LS_HIGH_SCORES_PREFIX = "highscores";
function loadHighScore(game: Game, musicType: MusicType) {
    const key = `${LS_HIGH_SCORES_PREFIX}_${game.id}_${musicType}`;
    const raw = localStorage.getItem(key);
    return raw ? parseInt(raw) : 0;
}
function saveHighScore(game: Game, musicType: MusicType, newScore: number) {
    const key = `${LS_HIGH_SCORES_PREFIX}_${game.id}_${musicType}`;
    localStorage.setItem(key, `${newScore}`);
}

const GITHUB_URL = "https://github.com/roginvs/ear-gym";

interface GameRootState {
    playing?: {
        game: Game;
        musicType: MusicType;
        startLevel: number;
    };
    readyToStart?: {
        game: Game;
        musicType: MusicType;
    };
}

const GAMES: Game[] = [EQ_GAME_PLUS, EQ_GAME_MINUS, GAIN_GAME];

export class GameRoot extends React.Component<
    {
        audioCtx: AudioContext;
        playSound: GameSoundPlayer;
    },
    GameRootState
> {
    state: GameRootState = {};
    render() {
        const playing = this.state.playing;
        return (
            <div className="container mt-2">
                {!playing ? (
                    <DivFadeinCss className="mt-2" key="gamelist">
                        <div className="container mb-2 text-center">
                            <h1>{l.welcome}</h1>
                            <p>{l.welcome2}</p>
                        </div>
                        <div className="container mb-4 text-center">
                            {GAMES.map(game => (
                                <div className="card mb-2" key={game.id}>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {game.name}
                                        </h5>
                                        <h6 className="card-subtitle mb-2 text-muted">
                                            {game.description}
                                        </h6>

                                        {this.state.readyToStart &&
                                        this.state.readyToStart.game.id ===
                                            game.id ? (
                                            <DivFadeinCss
                                                key={
                                                    "readytostart" +
                                                    this.state.readyToStart
                                                        .musicType
                                                }
                                            >
                                                <div className="card ml-auto mr-auto"
                                                style={{
                                                    maxWidth: "20em"
                                                }}>
                                                    <div className="card-body">
                                                        <h5 className="card-title">
                                                            {musicTypeToName(
                                                                this.state
                                                                    .readyToStart
                                                                    .musicType
                                                            )}
                                                        </h5>
                                                        {/* <p class="card-text">
                                                    music type image here
                                                    </p> */}
                                                        <div className="mb-1">
                                                            {range(
                                                                1,
                                                                game.maxLevels +
                                                                    1
                                                            ).map(lvl => {
                                                                const readyToStart =  this
                                                                .state
                                                                .readyToStart;
                                                                if (!readyToStart) {
                                                                    return null;
                                                                }
                                                                const maxLevel = loadHighScore(
                                                                          readyToStart
                                                                              .game,
                                                                          readyToStart
                                                                              .musicType
                                                                      );

                                                                return (
                                                                    <button
                                                                        className={classnames(
                                                                            "btn m-1 btn-primary"
                                                                        )}
                                                                        disabled={
                                                                            lvl >
                                                                        (maxLevel || 1)
                                                                        }
                                                                        key={
                                                                            lvl
                                                                        }
                                                                        onClick={() => this.setState({
                                                                            playing: {
                                                                                game: readyToStart.game,
                                                                                musicType: readyToStart.musicType,
                                                                                startLevel: lvl,
                                                                            },
                                                                            readyToStart: undefined,                                                                        
                                                                        })}
                                                                    >
                                                                        {
                                                                            l.level
                                                                        }{" "}
                                                                        {lvl}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        <div>
                                                            <button className="btn btn-light"
                                                            onClick={() => this.setState({
                                                                readyToStart: undefined
                                                            })}
                                                            >
                                                                <i className="fa fa-reply" />{" "}
                                                                {l.back}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DivFadeinCss>
                                        ) : <DivFadeinCss key="types">
                                            {GAME_MUSIC_TYPES.map(musicType => {
                                                const maxLevel = loadHighScore(
                                                    game,
                                                    musicType
                                                );
                                                return (
                                                    <button
                                                        className="btn btn-light m-1"
                                                        key={musicType}
                                                        onClick={() => {
                                                            this.setState({
                                                                readyToStart: {
                                                                    game,
                                                                    musicType
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <div>
                                                            {musicTypeToName(
                                                                musicType
                                                            )}
                                                        </div>
                                                        <div>
                                                            {range(
                                                                1,
                                                                game.maxLevels +
                                                                    1
                                                            ).map(lvl => (
                                                                <span
                                                                    key={
                                                                        lvl +
                                                                        "-" +
                                                                        maxLevel
                                                                    }
                                                                >
                                                                    <i
                                                                        className={classnames(
                                                                            "fa",
                                                                            lvl <
                                                                            maxLevel
                                                                                ? "fa-star"
                                                                                : "fa-star-o"
                                                                        )}
                                                                    />
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        }
                                        </DivFadeinCss>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="container mt-2 text-center">
                            <p className="text-muted">
                                <a href={GITHUB_URL}>{GITHUB_URL}</a>
                            </p>
                        </div>
                    </DivFadeinCss>
                ) : (
                    <GameController
                        audioCtx={this.props.audioCtx}
                        game={playing.game}
                        startLevel={playing.startLevel}
                        playSound={this.props.playSound}
                        musicType={playing.musicType}
                        onNewLevel={newMaxLevel => {
                            const maxLevel = loadHighScore(
                                playing.game,
                                playing.musicType
                            );
                            if (newMaxLevel > maxLevel) {
                                saveHighScore(
                                    playing.game,
                                    playing.musicType,
                                    newMaxLevel
                                );
                            }
                        }}
                        onReturn={() => {                            
                            this.setState({
                                playing: undefined,
                                readyToStart: undefined
                            });
                        }}
                    />
                )}
            </div>
        );
    }
}
