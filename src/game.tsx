import * as React from "react";

export const MAX_STAGES = 20;
import classnames from "classnames";
import { GameSoundPlayer } from "./utils";
import l from "./lang";
import { MusicType } from "./music";

export interface GameStageRenderProps {
    music: AudioBuffer[];
    musicType: MusicType;
    audioCtx: AudioContext;
    level: number;
    onAnswer: (isOk: boolean) => void;
    onExit: () => void;
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

export class ExitButton extends React.Component<
    {
        onClick: () => void;
    },
    {}
> {
    render() {
        return (
            <button
                onClick={this.props.onClick}
                className={classnames("btn btn-secondary mx-1")}
            >
                <i className={classnames("fa fa-fw fa-sign-out")} />
            </button>
        );
    }
}

export class GameBottom extends React.Component<
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
