import * as React from "react";
import l from "./lang";
import { assertNever, range } from "./utils";

import { Game, GameStageProps } from "./game";

function lvlInfo(level: number) {
const lvlInfoData: {
    bandsTotal: number,
    bandsAltered: number,
    dbStep: number
}[] = [{
    bandsTotal: 10,
    bandsAltered: 2,
    dbStep: 3
}];
    return lvlInfoData[level - 1]
}

interface EQ2GameState {
    correctDbs: number[];
    userDbs: number[];
}
class EQ2Game extends React.Component<GameStageProps,EQ2GameState>{
    bands = range(0, lvlInfo(this.props.level).bandsTotal);
    state = (() => {        
        return {
            correctDbs: this.bands.map((x, id) => id % 2 ? 0 : 6),
            userDbs: this.bands.map(x => 0),
        }
    })();


    fxes = this.bands.map(x => this.props.audioCtx.createBiquadFilter());
    componentDidUpdate() {
        this.updateFx();
    }
    componentDidMount() {
        this.updateFx();                
        const gainNode = this.props.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.8, 0);
        this.props.srcAudio.connect(gainNode);
        gainNode.connect(this.fxes[0]);        
        this.fxes.map((fx, id) => id !== this.fxes.length -1 ? 
        this.fxes[id].connect(this.fxes[id+1]) : this.fxes[id].connect(this.props.audioCtx.destination));

        const minFreq = 100;
        const maxFreq = 12800;
        const max2Power = Math.log2(maxFreq / minFreq);
        const qStep = 2 ** (max2Power / this.fxes.length);
        this.fxes.map((fx, id) => {
            fx.type = "peaking";            
            const freq = minFreq* qStep ** id;
            fx.frequency.setValueAtTime(freq, 0);
            fx.Q.setValueAtTime(qStep, 0); // Maybe divide by two?
            console.info(`id=${id} freq=${freq} qStep=${qStep}`)
        });
    }

    updateFx() {        
        const eqGains = this.props.fxOn ? this.state.userDbs : this.state.correctDbs;
        console.info(eqGains);
        this.fxes.map((fx, id) => fx.gain.setValueAtTime(eqGains[id], 0));
    }

    
    componentWillUnmount() {
        this.fxes.map(fx => fx.disconnect());
    }
    render() {
        return <div>TODO</div>
    }
}

export const EQ2_GAME: Game = {
    id: "eq2",
    name: l.eq2game,
    description: l.eq2gamedesc,
    maxLevels: 8,
    eachStageFxOff: true,
    // levelInfo?: (levelNumber: number) => JSX.Element,
    stage: props => <EQ2Game {...props}/>
}