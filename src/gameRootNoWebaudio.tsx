import * as React from "react";
import l from "./lang";
import { DivFadeinCss } from "./common";
import { GAMES } from "./games";

export class GameRootNoWebaudio extends React.Component<{}, {}> {
    render() {
        return (
            <DivFadeinCss className="mt-2" key="gamelist">
                <div className="container mb-2 text-center">
                    <h1>{l.welcome}</h1>
                    <p>{l.welcome2}</p>
                    <p>{l.musicSourceInfo}</p>
                    <p>
                        <strong>{l.noWebAudioError}</strong>
                    </p>
                </div>
                <div className="container mb-4 text-center">
                    {GAMES.map(game => (
                        <div className="card mb-2" key={game.id}>
                            <div className="card-body">
                                <h5 className="card-title">{game.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">
                                    {game.description}
                                </h6>
                            </div>
                        </div>
                    ))}
                </div>
            </DivFadeinCss>
        );
    }
}
