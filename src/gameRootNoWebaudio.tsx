import * as React from "react";
import l from "./lang";
import { DivFadeinCss } from "./common";


export class GameRootNoWebaudio extends React.Component<{},{}> {
    render(){
return <DivFadeinCss className="mt-2" key="gamelist">
<div className="container mb-2 text-center">
    <h1>{l.welcome}</h1>
    <p>{l.welcome2}</p>
    <p>{l.musicSourceInfo}</p>
    <p>{l.noWebAudioError}</p>
</div>
</DivFadeinCss>
    }
}    