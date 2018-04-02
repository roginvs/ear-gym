import * as React from 'react';

import {GameStageRenderProps, Game, FxOnOffButton} from './game';


interface EqSelectorState {
    x?: number;
}
interface EqSelectorProps {
    q: number;
    correctFreq?: number;
    onAnswer: (freq: number) => void;
}
class EqSelector extends React.Component<EqSelectorProps, EqSelectorState> {
    state: EqSelectorState = {};

    componentWillReceiveProps(
        oldProps: EqSelectorProps,
        newProps: EqSelectorProps
    ) {
        if (
            oldProps.correctFreq === undefined &&
            newProps.correctFreq !== undefined
        ) {
            this.setState({
                x: undefined
            });
        }
    }

    get selectedFreq() {
        return this.state.x !== undefined
            ? Math.round(50 * 2 ** (this.state.x * 9))
            : undefined;
    }
    render() {
        const selectedFreq = this.selectedFreq;
        return (
            <div className="py-2">
                <div
                    className="bg-secondary rounded mx-2"
                    style={{
                        position: "relative",
                        height: "8em",
                        overflow: "hidden",
                        cursor: "pointer"
                    }}
                    onMouseMove={e => {
                        if (this.props.correctFreq) {
                            return;
                        }
                        const xPos = e.pageX - e.currentTarget.offsetLeft;
                        const xTotal = e.currentTarget.clientWidth;
                        this.setState({
                            x: xPos / xTotal
                        });
                    }}
                    onMouseLeave={() => {
                        if (this.props.correctFreq) {
                            return;
                        }
                        this.setState({ x: undefined });
                    }}
                    onClick={() => {
                        if (this.props.correctFreq) {
                            return;
                        }
                        const selectedFreq = this.selectedFreq;
                        if (selectedFreq) {
                            this.props.onAnswer(selectedFreq);
                        }
                    }}
                >
                    {selectedFreq !== undefined && this.state.x ? (
                        <div
                            style={{
                                position: "absolute",
                                left: `${100 * this.state.x -
                                    100 / 9 / 2 * this.props.q}%`,
                                width: `${100 / 9 * this.props.q}%`,
                                top: "0em",
                                bottom: "0em",
                                backgroundColor: "grey"
                            }}
                        >
                            <span
                                style={{
                                    position: "absolute",
                                    left: `50%`,
                                    width: 1,
                                    top: 0,
                                    bottom: 0,
                                    borderColor: "black",
                                    borderLeftStyle: "solid",
                                    borderWidth: 1
                                }}
                            />
                            <span
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: "3em",
                                    textAlign: "center",
                                    color: "white",
                                    fontWeight: "bold"
                                }}
                            >
                                {selectedFreq}Hz
                            </span>
                        </div>
                    ) : null}

                    {this.props.correctFreq !== undefined ? (
                        <div
                            style={{
                                position: "absolute",
                                left: `${Math.log2(
                                    this.props.correctFreq / 50
                                ) /
                                    9 *
                                    100}%`,
                                width: 1,
                                top: "0em",
                                bottom: "0em",
                                backgroundColor: "yellow"
                            }}
                        >
                            <span
                                style={{
                                    color: "yellow",
                                    fontWeight: "bold"
                                }}
                            >
                                {" "}
                                {this.props.correctFreq}Hz
                            </span>
                        </div>
                    ) : null}

                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: "0.5em",
                            bottom: "2em"
                        }}
                    />
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <span
                            key={"line" + i}
                            style={{
                                left: `${i * 100 / 9}%`,
                                width: 1,
                                position: "absolute",
                                top: "1em",
                                bottom: "2.5em",
                                borderWidth: 1,
                                borderLeftStyle: "solid",
                                borderColor: "lightgrey"
                            }}
                        />
                    ))}

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                        <span
                            key={"fr1-" + i}
                            style={{
                                textAlign: "center",
                                position: "absolute",
                                left: `${(i - 1) * 100 / 9}%`,
                                width: `${100 / 9}%`,
                                top: "5.5em",
                                height: "1em",
                                color: "lightgrey"
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.7em"
                                }}
                            >
                                {Math.round(100 / Math.sqrt(2) * 2 ** (i - 1))}Hz
                            </span>
                        </span>
                    ))}

                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <span
                            key={"fr1-" + i}
                            style={{
                                textAlign: "center",
                                position: "absolute",
                                left: `${(i - 1) * 100 / 9 + 100 / 9 / 2}%`,
                                width: `${100 / 9}%`,
                                top: "6.5em",
                                height: "1em",
                                color: "lightgrey"
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.7em"
                                }}
                            >
                                {100 * 2 ** (i - 1)}Hz
                            </span>
                        </span>
                    ))}
                </div>
            </div>
        );
    }
}

interface GameState {
    fxActive: boolean;
    correctFreq?: number;
    answeredFreq?: number;
}

const EQ_STAGES_Q_GAIN=[
    [2, 12], [2, 9], [2, 6], [1, 12], [1, 9], [1, 6], [2, 3], [1, 3]
];

class EqStage extends React.Component<GameStageRenderProps,GameState>{
    mounted = false;
    state: GameState = {
        fxActive: false
    };

    componentDidMount() {
        this.mounted = true;
        this.startMusic();
    }
    biquadFilter?: BiquadFilterNode;

    startMusic = () => {
        if (!this.mounted) {
            return;
        }
        
        if (this.biquadFilter) {
            console.warn(`Start when already have biquadFilter`);
            this.biquadFilter.disconnect();
            this.biquadFilter = undefined;
        }
        const correctFreq = Math.round(100 * 2 ** (Math.random() * 7));
        this.setState({
            correctFreq,
            answeredFreq: undefined
        });

        const source = this.props.audioCtx.createBufferSource();
        const i = Math.floor(Math.random() * this.props.music.length);
        const music = this.props.music[i];
        source.buffer = music;

        this.biquadFilter = this.props.audioCtx.createBiquadFilter();

        this.biquadFilter.type = "peaking";        
        this.biquadFilter.frequency.setValueAtTime(correctFreq, 0);

        this.setQAndGain();

        const gainNode = this.props.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.8, 0);

        source.connect(gainNode);
        gainNode.connect(this.biquadFilter);
        this.biquadFilter.connect(this.props.audioCtx.destination);

        source.loop = true;
        source.start(0, Math.random() * music.duration);
    };

    setQAndGain = () => {
        const [q, gain] = EQ_STAGES_Q_GAIN[this.props.level];
        if (this.biquadFilter) {
        this.biquadFilter.Q.setValueAtTime(q, 0);
        this.biquadFilter.gain.setValueAtTime(
            this.state.fxActive ? gain : 0,
            0
        );
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.biquadFilter) {
            this.biquadFilter.disconnect();
            this.biquadFilter = undefined;
        }
    }


    onAnswer = (freq: number) => {
        const correctFreq = this.state.correctFreq;
        if (correctFreq === undefined) {
            return;
        }
        this.setState({
            answeredFreq: freq
        });
        if (this.biquadFilter) {
            this.biquadFilter.disconnect();
            this.biquadFilter = undefined;
        }
        const [q, gain] = EQ_STAGES_Q_GAIN[this.props.level];
        const freqMax = correctFreq * 2 ** (q / 2);
        const freqMin = correctFreq / 2 ** (q / 2);
        const correct = freq >= freqMin && freq <= freqMax;
        console.info(
            `level=${this.props.level}
            } answered=${freq} correct=${correctFreq} ` +
                `freqMin=${freqMin} freqMax=${freqMax} correct=${correct}`
        );
        if (correct) {
            this.props.playSound('correct')
        } else {
                this.props.playSound('wrong')
        }        
        setTimeout(() => {
            this.props.onReturn(correct)
        }, 3000);
    };


    toggleFx = (newFxActive: boolean) => {
        this.setState({ fxActive: newFxActive }, this.setQAndGain);                    
    };


    render () {
        const [q, gain] = EQ_STAGES_Q_GAIN[this.props.level];
        return <div>
                            <EqSelector
                    q={q}
                    correctFreq={
                        this.state.answeredFreq
                            ? this.state.correctFreq
                            : undefined
                    }
                    onAnswer={this.onAnswer}
                />
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
    }
}


export const EQ_GAME: Game = {
    id: 'eqplus',
    name: 'Equalizer',
    description: 'Find boosted frequency',
    maxLevels: 8,
    stageRender: props => <EqStage {...props}/>
}