import * as React from "react";
import l from "./lang";

import { GameStageProps, Game } from "./game";
import { assertNever, range } from "./utils";
import classnames from 'classnames';

interface ChoiceSelectorProps {
    names: string[];
    correctId?: number;
    onAnswer: (nameId: number) => void;
}
interface ChoiceSelectorState {
    answeredId?: number;
}
export class ChoiceSelector extends React.Component<
    ChoiceSelectorProps,
    ChoiceSelectorState
> {
    state: ChoiceSelectorState = {};

    render() {
        const col = Math.floor(12 / this.props.names.length);
        return (
            <div className="py-2">
                <div
                    className="bg-secondary rounded mx-2 d-flex align-items-stretch"
                    style={{
                        position: "relative",
                        height: "8em",
                        overflow: "hidden",
                        cursor: "pointer"
                    }}
                >
                    {this.props.names.map((name, id) => {
                        return <button key={id} className={classnames(`btn btn-block my-2 mx-2`,
                        this.props.correctId !== undefined ? 
                        this.props.correctId === id && this.state.answeredId === id ? "btn-success" :
                         this.props.correctId === id && this.state.answeredId !== id ? "btn-info" :
                        this.props.correctId !== id && this.state.answeredId === id ? "btn-danger" : 'btn-light'
                        : "btn-light"
                    )}
                        onClick={() => {
                            if (this.props.correctId !== undefined) {
                                return
                            }
                            this.setState({
                                answeredId: id
                            });
                            this.props.onAnswer(id)
                        }}
                        >
                            {name}
                        </button>
                    })}
                </div>
            </div>
        );
    }
}

interface GameState {   
    firstGain: number; 
    correctId: number;
    answeredId?: number;    
}

const DIST_CHOICES = [    
    [6, 2],    
    [5, 2],
    [4, 3],
    [3, 4],
    [2, 2],
    [2, 4],
    [1, 2],
    [1, 4]
];

const GAIN_RANGE = 12;

class GainStage extends React.Component<GameStageProps, GameState> {
    fx: GainNode = this.props.audioCtx.createGain();

    componentDidUpdate() {
        this.updateFx();
    }
    componentDidMount() {
        this.updateFx();
        const gainNode = this.props.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.8, 0);

        this.props.srcAudio.connect(gainNode);
        gainNode.connect(this.fx);
        this.fx.connect(this.props.audioCtx.destination);
    }

    state: GameState = (() => {
        const musicType = this.props.musicType;
        const [gainStep, gainNumbers] = DIST_CHOICES[this.props.level-1];
        const startMin = -GAIN_RANGE;
        const startMax = GAIN_RANGE - gainNumbers * gainStep;
        const firstGain =
            Math.floor(Math.random() * (startMax - startMin)) + startMin;
        
        const correctId = Math.floor(Math.random() * gainNumbers);

        return {
            firstGain,
            correctId
        }
    })();

    
    updateFx() {
        const [gainStep, gainNumbers] = DIST_CHOICES[this.props.level-1];
            const gainDb =
                this.state.firstGain + this.state.correctId * gainStep;                
            // "gainDb / 20" instead of "/10" because decibells is power measure 
            this.fx.gain.setValueAtTime(
                this.props.fxOn ? 10 ** (gainDb / 20) : 1,
                0
            );
    }



    componentWillUnmount() {     
            this.fx.disconnect();                    
    }




    render() {
        const [gainStep, gainNumbers] = DIST_CHOICES[this.props.level-1];
        const firstGain = this.state.firstGain;
        return (
            <div>
                {firstGain !== undefined ? (
                    <ChoiceSelector
                        names={range(0, gainNumbers).map(i => {
                            const boost = firstGain + i * gainStep;
                            return `${boost}${l.db}`;
                        })}
                        correctId={
                            this.state.answeredId !== undefined
                                ? this.state.correctId
                                : undefined
                        }
                        onAnswer={answeredId => {
                            
    
        const correctId = this.state.correctId;
        if (correctId === undefined) {
            return;
        }
        this.setState({
            answeredId
        });
     
        const correct = answeredId === correctId;
        console.info(
            `level=${this.props.level} ` +
                `answered=${answeredId} correct=${correctId} ` +
                `correct=${correct}`
        );

        this.props.onAnswer(correct ? "right" : "wrong");        
    
                        }}
                    />
                ) : null}

                
            </div>
        );
    }
}

export const GAIN_GAME: Game = {
    id: "gain",
    name: l.gain,
    description: l.gaindesc,
    maxLevels: 8,
    stage: props => <GainStage {...props} />
};
