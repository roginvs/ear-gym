import * as React from "react";
import classnames from 'classnames';

//import l from "./lang";

interface GameSelectorChoiceProps {
    names: (string | JSX.Element)[];
    correctId?: number;
    onAnswer: (nameId: number) => void;
}
interface GameSelectorChoiceState {
    answeredId?: number;
}
export class GameSelectorChoice extends React.Component<
    GameSelectorChoiceProps,
    GameSelectorChoiceState
> {
    state: GameSelectorChoiceState = {};

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