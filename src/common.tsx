import * as React from "react";


export class DivFadeinCss extends React.Component<
    {
        className?: string;
        tagName?: string;
    },
    {
        entered: boolean;
    }
> {
    state = {
        entered: false
    };
    componentWillMount() {
        this.setState({
            entered: false
        });
    }
    componentDidMount() {
        this.mounted = true;
        setTimeout(() => {
            if (this.mounted) {
                this.setState({
                    entered: true
                });
            }
        }, 10);
    }
    private mounted = false;
    componentWillUnmount() {
        this.mounted = false;
        //console.info('Will unmount')
    }
    render() {
        const TagName = this.props.tagName || "div";
        return (
            <TagName
            style={{
                opacity: this.state.entered ? 1 : 0.01,
                transition: this.state.entered ? "opacity 250ms ease-in" : undefined,
            }}
                className={this.props.className}                
            >
                {this.props.children}
            </TagName>
        );
    }
}


export class Loader extends React.Component<{
    info?: string
}, {}> {
    render() {
        return (
            <DivFadeinCss className="p-3 text-center">
                <i className="fa fa-spinner fa-spin" />
                <span> Загрузка{this.props.info ? ' ' + this.props.info : ''}...</span>
            </DivFadeinCss>
        );
    }
}

