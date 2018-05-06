import * as React from "react";
import l from "./lang";

import { GameStageProps, Game } from "./game";
import { assertNever, range } from "./utils";
import classnames from 'classnames';
import { GameSelectorChoice } from "./gameSelectorChoice";

interface GameState {   
    firstGain: number; 
    correctId: number;
    answeredId?: number;    
}

const LEVELS_DISTANCE_CHOICES = [    
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
        const [gainStep, gainNumbers] = LEVELS_DISTANCE_CHOICES[this.props.level-1];
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
        const [gainStep, gainNumbers] = LEVELS_DISTANCE_CHOICES[this.props.level-1];
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
        const [gainStep, gainNumbers] = LEVELS_DISTANCE_CHOICES[this.props.level-1];
        const firstGain = this.state.firstGain;
        return (
            <div>
                {firstGain !== undefined ? (
                    <GameSelectorChoice
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
    maxLevels: LEVELS_DISTANCE_CHOICES.length,
    eachStageFxOff: true,
    stage: props => <GainStage {...props} />
};
