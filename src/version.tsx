import * as React from "react";

interface VersionInfo {
    hash: string;
    date: string;
}

const VERSION_FNAME = "version.json";

interface VersionState {
    info?: VersionInfo;
    error?: string;
}
export class Version extends React.Component<{}, VersionState> {
    state: VersionState = {};

    componentDidMount() {
        fetch(VERSION_FNAME)
            .then(d => d.json())
            .then(info => this.setState({ info }))
            .catch(e => this.setState({ error: e.message }));
    }
    render() {
        if (this.state.error) {
            return <span>{this.state.error}</span>
        }
        if (! this.state.info){
            return <span>...</span>
        }
        return <span>Build at {new Date(this.state.info.date).toString()}</span>
    }
}
