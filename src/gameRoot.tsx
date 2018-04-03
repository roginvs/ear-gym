import * as React from "react";
import { Game } from "./game";
import { GameController } from "./gameController";
import { MusicType, GAME_MUSIC_TYPES, musicTypeToName } from "./music";
import { EQ_GAME_PLUS, EQ_GAME_MINUS } from "./eqGame";
import { DivFadeinCss } from "./common";
import { range, GameSoundPlayer } from "./utils";
import classnames from "classnames";
import l from "./lang";

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

interface GameRootState {
    playingGame?: Game;
    playingMusicType?: MusicType;
}

const GAMES: Game[] = [EQ_GAME_PLUS, EQ_GAME_MINUS];

export class GameRoot extends React.Component<
    {
        audioCtx: AudioContext;
        playSound: GameSoundPlayer;
    },
    GameRootState
> {
    state: GameRootState = {};
    render() {
        const game = this.state.playingGame;
        const musicType = this.state.playingMusicType;
        return (
            <div className="container mt-2">
                {!game || !musicType ? (
                    <DivFadeinCss className="mt-2" key="gamelist">
                    <div className="container mb-2 text-center">
                    <h1>{l.welcome}</h1>
                    <p>{l.welcome2}</p>
                    </div>
                        <div className="container mb-4">
                            {GAMES.map(game => (
                                <div className="card mb-2" key={game.id}>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {game.name}
                                        </h5>
                                        <h6 className="card-subtitle mb-2 text-muted">
                                            {game.description}
                                        </h6>

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
                                                            playingGame: game,
                                                            playingMusicType: musicType
                                                        });
                                                    }}
                                                >
                                                    <div>{musicTypeToName(musicType)}</div>
                                                    <div>
                                                        {range(
                                                            1,
                                                            game.maxLevels + 1
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
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="container mt-2 text-center">
                        <p className="text-muted">
                        <a href="https://github.com/roginvs/ear-gym">https://github.com/roginvs/ear-gym</a>
                        </p>
                        </div>
                    </DivFadeinCss>
                ) : (
                    <GameController
                        audioCtx={this.props.audioCtx}
                        game={game}
                        playSound={this.props.playSound}
                        musicType={musicType}
                        onReturn={newMaxLevel => {
                            const maxLevel = loadHighScore(game, musicType);
                            if (newMaxLevel > maxLevel) {
                                saveHighScore(game, musicType, newMaxLevel);
                            }
                            this.setState({
                                playingGame: undefined,
                                playingMusicType: undefined
                            });
                        }}
                    />
                )}
            </div>
        );
    }
}
