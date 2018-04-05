import React, {Component} from 'react';
import Factor from './components/Factor';
import {netDate} from './utils';
import logo from './svg/logo_fix.svg';

export default class Display extends Component {
    render() {
        let display;
        if(this.props.screen){
            display = [
                <p key="heading" className="heading"><img src={logo} className="logo-top" alt="logo"/><span>{this.props.sport.N.toUpperCase()}</span> <span>LIVE</span></p>,
                <small key="test" className="dev-code">testing event: {this.props.eventId}</small>,
                <h3 key="event" className="event-heading">
                    <span className="start-time">{netDate(this.props.data[0].D)}</span>
                    <span className="name">{this.props.data[0].N}</span>
                    <span className="status">{this.props.data[0].ES}</span>
                    {this.props.data[0].PT>0 && <span className="passed-time">{this.props.data[0].PT}'</span>}
                    <span className="score-total">{this.props.data[0].HS+':'+this.props.data[0].AS}</span>
                    <span className="score-details">( {this.props.data[0].SS} )</span>
                    {/*<span className="totalScore">{this.props.data[0].GS}</span>*/}
                </h3>,
                <h4 key="champ" className="event-subheading">{this.props.data[0].CN}</h4>,
                <div key="details" className="feed-wrapper">{this.props.data.map((event, i) => (
                    <div key={i} className="feed">
                        <h5 className="stake-part-heading">P:{event.P} - EPTId:{event.EPTId}</h5>
                        {event.StakeTypes.length > 0 ? event.StakeTypes.map((stakeType, sti) => (<div className={stakeType.Stakes.length>3 ? "full-block" : "short-block"} key={sti + '-wrapper'}>
                            <p key={sti} className="factor-block-heading">{stakeType.N} <small className="dev-code">[{stakeType.Id} / {stakeType.Stakes.length}]</small></p>
                            <div key={sti + '-stakes'}>{stakeType.Stakes.map((stake, si) => (
                                <span key={si} title={stake.SFN} className="factor-block"><span className="factor-name">{stake.N} {stake.A !== null && `(${stake.A})`}</span> - <Factor factor={stake.F}/> </span>
                            ))}</div>
                        </div>)) : <p>Ставки временно не принимаются</p>}
                    </div>
                ))}</div>
            ]
        } else {
            display = <div className="screenLogo"><img src={this.props.logo} alt="r-bet logo" /></div>
        }
        return display
    }
}