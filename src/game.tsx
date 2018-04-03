import * as React from 'react';

export const MAX_STAGES = 20;
import classnames from 'classnames';
import { GameSoundPlayer } from './utils';
import l from './lang';

export interface GameStageRenderProps {
    music: AudioBuffer[];
    audioCtx: AudioContext;
    level: number;
    playSound: GameSoundPlayer;
    onReturn: (isOk: boolean | undefined) => void;
}

export interface Game {
    id: string;
    name: string;
    description: string;
    maxLevels: number;
    stageRender: (props: GameStageRenderProps) => JSX.Element;
}


export class FxOnOffButton extends React.Component<
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
