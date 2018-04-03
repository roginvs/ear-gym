import * as React from "react";
import l from "./lang";
import { GameStageRenderProps, Game, FxOnOffButton } from "./game";
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
class ChoiceSelector extends React.Component<
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
    fxActive: boolean;
    correctId?: number;
    answeredId?: number;
    firstGain?: number;
}

const DIST_CHOICES = [
    //[6, 2],
    [3, 3],
    [5, 2],
    [4, 3],
    [3, 4],
    [2, 2],
    [2, 4],
    [1, 2],
    [1, 4]
];

const GAIN_RANGE = 12;

class GainStage extends React.Component<GameStageRenderProps, GameState> {
    mounted = false;
    state: GameState = {
        fxActive: false
    };

    componentDidMount() {
        this.mounted = true;
        this.startMusic();
    }
    fx?: GainNode;

    startMusic = () => {
        if (!this.mounted) {
            return;
        }

        if (this.fx) {
            console.warn(`Start when already have fx filter`);
            this.fx.disconnect();
            this.fx = undefined;
        }
        const musicType = this.props.musicType;

        const [gainStep, gainNumbers] = DIST_CHOICES[this.props.level-1];
        const startMin = -GAIN_RANGE;
        const startMax = GAIN_RANGE - gainNumbers * gainStep;
        const firstGain =
            Math.floor(Math.random() * (startMax - startMin)) + startMin;
        
        const correctId = Math.floor(Math.random() * gainNumbers);
        console.info(`startMin=${startMin} startMax=${startMax} firstGain=${firstGain} correctId=${correctId} `+
    `gainStep=${gainStep} gainNumbers=${gainNumbers} correctdb=${firstGain + correctId*gainStep}`);

        this.setState({
            firstGain,
            correctId
        });

        const source = this.props.audioCtx.createBufferSource();
        const i = Math.floor(Math.random() * this.props.music.length);
        const music = this.props.music[i];
        source.buffer = music;

        this.fx = this.props.audioCtx.createGain();

        this.setFxGain();

        const gainNode = this.props.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.8, 0);

        source.connect(gainNode);
        gainNode.connect(this.fx);
        this.fx.connect(this.props.audioCtx.destination);

        source.loop = true;
        source.start(0, 0);
    };

    setFxGain = () => {
        if (
            this.fx &&
            this.state.firstGain !== undefined &&
            this.state.correctId !== undefined
        ) {
            const [gainStep, gainNumbers] = DIST_CHOICES[this.props.level-1];
            const gainDb =
                this.state.firstGain + this.state.correctId * gainStep;                
            this.fx.gain.setValueAtTime(
                this.state.fxActive ? 10 ** (gainDb / 20) : 1, // why 20?
                0
            );
        }
    };

    componentWillUnmount() {
        this.mounted = false;
        if (this.fx) {
            this.fx.disconnect();
            this.fx = undefined;
        }
    }

    onAnswer = (answeredId: number) => {
        const correctId = this.state.correctId;
        if (correctId === undefined) {
            return;
        }
        this.setState({
            answeredId
        });
        if (this.fx) {
            this.fx.disconnect();
            this.fx = undefined;
        }
        const correct = answeredId === correctId;
        console.info(
            `level=${this.props.level} ` +
                `answered=${answeredId} correct=${correctId} ` +
                `correct=${correct}`
        );

        this.props.onAnswer(correct);
        setTimeout(() => {
            this.props.onReturn();
        }, 3000);
    };

    toggleFx = (newFxActive: boolean) => {
        this.setState({ fxActive: newFxActive }, this.setFxGain);
    };

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
                        onAnswer={this.onAnswer}
                    />
                ) : null}
                <div className="text-center">
                    <FxOnOffButton
                        active={this.state.fxActive}
                        type="off"
                        onClick={() => this.toggleFx(false)}
                    />

                    <FxOnOffButton
                        active={!this.state.fxActive}
                        type="on"
                        onClick={() => this.toggleFx(true)}
                    />
                </div>
            </div>
        );
    }
}

export const GAIN_GAME: Game = {
    id: "gain",
    name: l.gain,
    description: l.gaindesc,
    maxLevels: 8,
    stageRender: props => <GainStage {...props} />
};
