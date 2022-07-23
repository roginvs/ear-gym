import * as React from "react";
import { Game } from "./game";
import { GameController } from "./gameController";
import { MusicType, GAME_MUSIC_TYPES, musicTypeToName } from "./music";
import { DivFadeinCss } from "./common";
import { range, GameSoundPlayer } from "./utils";
import classnames from "classnames";
import l from "./lang";
import { GAMES } from "./games";
import { Version } from "./version";
//import { GAIN_GAME } from "./gainGame";
// import {Collapse} from "reactstrap";

const LS_HIGH_SCORES_PREFIX = "highscores";

/**
 * Return array of passed levels where index is level number
 * Zero index is always true
 */
function loadHighScores(game: Game, musicType: MusicType) {
  //if (location.hostname === 'localhost') {
  //    return 100
  // }
  const oldkey = `${LS_HIGH_SCORES_PREFIX}_${game.id}_${musicType}`;
  const oldraw = localStorage.getItem(oldkey);
  const oldMaxLevel = oldraw ? parseInt(oldraw) : 0;

  const newkey = `${LS_HIGH_SCORES_PREFIX}_${game.id}_${musicType}_arr`;
  let scores: (boolean | undefined | null)[] = [];
  try {
    const raw = localStorage.getItem(newkey);
    scores = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(scores)) {
      scores = [];
    }
  } catch (e) {
    console.warn(`Local storage error`, e);
  }

  for (let i = 0; i < oldMaxLevel; i++) {
    scores[i] = true;
  }
  return scores;
}
function saveHighScores(game: Game, musicType: MusicType, passedLevel: number) {
  const key = `${LS_HIGH_SCORES_PREFIX}_${game.id}_${musicType}_arr`;

  const currentScores = loadHighScores(game, musicType);
  currentScores[passedLevel - 1] = true;

  localStorage.setItem(key, JSON.stringify(currentScores));
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
              <p>{l.musicSourceInfo}</p>
            </div>
            <div className="container mb-4 text-center">
              {GAMES.map((game) => (
                <div className="card mb-2" key={game.id}>
                  <div className="card-body">
                    <h5 className="card-title">{game.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {game.description}
                    </h6>

                    {this.state.readyToStart &&
                    this.state.readyToStart.game.id === game.id ? (
                      <DivFadeinCss
                        key={"readytostart" + this.state.readyToStart.musicType}
                      >
                        <div
                          className="card ml-auto mr-auto"
                          style={{
                            maxWidth: "20em",
                          }}
                        >
                          <div className="card-body">
                            <h5 className="card-title">
                              {musicTypeToName(
                                this.state.readyToStart.musicType
                              )}
                            </h5>
                            {/* <p class="card-text">
                                                    music type image here
                                                    </p> */}
                            <div className="mb-1">
                              {range(1, game.maxLevels + 1).map((lvl) => {
                                const readyToStart = this.state.readyToStart;
                                if (!readyToStart) {
                                  return null;
                                }

                                const passedLevels = loadHighScores(
                                  readyToStart.game,
                                  readyToStart.musicType
                                );
                                const maxPassedLevel = passedLevels.reduce(
                                  (prev, curr, currIndex) => {
                                    if (curr) {
                                      return currIndex;
                                    } else {
                                      return prev;
                                    }
                                  },
                                  0
                                );

                                return (
                                  <button
                                    className={classnames(
                                      "btn m-1",
                                      lvl === maxPassedLevel + 1
                                        ? "btn-primary"
                                        : "btn-light"
                                    )}
                                    key={lvl}
                                    onClick={() => {
                                      this.props.audioCtx
                                        .resume()
                                        .catch((e) => console.warn(e));
                                      this.props.playSound(
                                        "silenceIosWorkaround"
                                      );
                                      this.setState({
                                        playing: {
                                          game: readyToStart.game,
                                          musicType: readyToStart.musicType,
                                          startLevel: lvl,
                                        },
                                        readyToStart: undefined,
                                      });
                                    }}
                                  >
                                    <i
                                      className={classnames(
                                        "fa mr-2",
                                        passedLevels[lvl]
                                          ? "fa-star"
                                          : "fa-star-o"
                                      )}
                                    />
                                    {l.level} {lvl}
                                  </button>
                                );
                              })}
                            </div>
                            <div>
                              <button
                                className="btn btn-light"
                                onClick={() =>
                                  this.setState({
                                    readyToStart: undefined,
                                  })
                                }
                              >
                                <i className="fa fa-reply" /> {l.back}
                              </button>
                            </div>
                          </div>
                        </div>
                      </DivFadeinCss>
                    ) : (
                      <DivFadeinCss key="types">
                        {GAME_MUSIC_TYPES.map((musicType) => {
                          const passedLevels = loadHighScores(game, musicType);

                          return (
                            <button
                              className="btn btn-light m-1"
                              key={musicType}
                              onClick={() => {
                                this.setState({
                                  readyToStart: {
                                    game,
                                    musicType,
                                  },
                                });
                              }}
                            >
                              <div>{musicTypeToName(musicType)}</div>
                              <div>
                                {range(1, game.maxLevels + 1).map((lvl) => (
                                  <span key={`${lvl}-${passedLevels[lvl]}`}>
                                    <i
                                      className={classnames(
                                        "fa",
                                        passedLevels[lvl]
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
                      </DivFadeinCss>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="container mt-2 text-center">
              <p className="text-muted">
                <a href={GITHUB_URL}>{GITHUB_URL}</a>
              </p>
              <p className="text-muted">
                <small>
                  <Version />
                </small>
              </p>
            </div>
          </DivFadeinCss>
        ) : (
          <GameController
            audioCtx={this.props.audioCtx}
            game={playing.game}
            startingLevel={playing.startLevel}
            playSound={this.props.playSound}
            musicType={playing.musicType}
            onNewLevel={(newMaxLevel) => {
              saveHighScores(playing.game, playing.musicType, newMaxLevel);
            }}
            onReturn={() => {
              this.setState({
                playing: undefined,
                readyToStart: undefined,
              });
            }}
          />
        )}
      </div>
    );
  }
}
