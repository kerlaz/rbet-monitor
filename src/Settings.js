import React, {Component} from 'react';

export default class Settings extends Component {
    render() {
        return <div className="settings">{this.props.children}</div>
    }
}