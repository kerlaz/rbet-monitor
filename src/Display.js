import React, {Component} from 'react';
import Factor from './components/Factor';

export default class Display extends Component {
    render() {
        return (
            [
                <p key="heading">testing event: {this.props.eventId}</p>,
                <h4 key="champ">{this.props.data[0].CN}</h4>,
                <div key="details">{this.props.data.map((event, i) => (
                    <div key={i}>
                        <h5>{event.N}</h5>
                        {event.StakeTypes.length > 0 ? event.StakeTypes.map((stakeType, sti) => ([
                            <p key={sti}>{stakeType.N}</p>,
                            <div key={sti + '-stakes'}>{stakeType.Stakes.map((stake, si) => (
                                <p key={si}>[<code>{stake.Id}</code>] {stake.N} - <Factor factor={stake.F}/></p>
                            ))}</div>
                        ])) : <p>Ставки временно не принимаются</p>}
                    </div>
                ))}</div>
            ]
        )
    }
}