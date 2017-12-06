import React, {Component} from 'react';


export default class Factor extends Component {
    constructor(){
        super();
        this.state = {
            lastFactor:null,
            delta:'equal'
        }
    }
    componentWillReceiveProps(newProps){
        let delta = '';
        if(newProps.factor < this.props.factor){
            delta = 'down'
        } else if(newProps.factor > this.props.factor){
            delta = 'up'
        } else {
            delta = this.state.delta;
        }
        this.setState({delta});
    }
    render(){
        return (
            <span className={'factor '+this.state.delta}>{this.props.factor}</span>
        )
    }
}