import React, {Component} from 'react';
import Factor from './components/Factor';
import {netDate, sortFactorGroups, scrollTo, isVisible} from './utils';
import logo from './svg/logo_fix.svg';

let currentHeight = 0;
let viewPortHeight = 0;

export default class Display extends Component {
    componentDidMount(){
        this.initAutoScroll();
        viewPortHeight = document.getElementsByClassName('feed-wrapper')[0].clientHeight;
        console.log(viewPortHeight);
    }
    componentDidUpdate(){
        // this.initAutoScroll();
    }
    initAutoScroll(){
        let page = document.getElementsByClassName('feed-wrapper')[0];
        let pageHeight = page.scrollHeight;
        if(pageHeight !== currentHeight) {
            currentHeight = pageHeight;
            console.log(page, pageHeight);
            setInterval(()=>{
                let currentY = page.scrollTop;
                if (currentY < pageHeight - viewPortHeight) {
                    scrollTo(page,currentY + viewPortHeight,1000)
                } else {
                    scrollTo(page,0,1000)
                }
                isVisible(document.getElementsByClassName("stake-part-heading"));
                console.log(currentY);
            },5000);
        }
    }
    render() {
        let display;
        if (this.props.screen) {
            display = [
                <header key="heading" className="top-bar">
                    <p className="heading">
                        <img src={logo} className="logo-top" alt="logo"/>
                        <span>{this.props.sport.N.toUpperCase()}</span>
                        <span>{this.props.mode}</span>
                    </p>
                    <small key="test" className="dev-code">Event:{this.props.eventId}</small>
                    <h3 key="event" className="event-heading">
                        <span className="start-time">{netDate(this.props.data[0].D)}</span>
                        <span className="name">{this.props.data[0].N}</span>
                        <span className="status">{this.props.data[0].ES}</span>
                        {this.props.data[0].PT > 0 && <span className="passed-time">{this.props.data[0].PT}'</span>}
                        {this.props.data[0].HS !== null && this.props.data[0].AS !== null &&
                        <span className="score-total">{this.props.data[0].HS + ':' + this.props.data[0].AS}</span>}
                        {this.props.data[0].SS !== null && this.props.data[0].SS !== "" &&
                        <span className="score-details">( {this.props.data[0].SS} )</span>}
                        {/*<span className="totalScore">{this.props.data[0].GS}</span>*/}
                    </h3>
                    <h4 key="champ" className="event-subheading">{this.props.data[0].CN}</h4></header>,
                <div key="details" className="feed-wrapper"> {this.props.data.map((event, i) => (
                    <div key={i} className="feed">
                        <h5 className="stake-part-heading">{sortFactorGroups(event.P + ":" + event.EPTId)}</h5>
                        {event.StakeTypes.length > 0 ? event.StakeTypes.map((stakeType, sti) => (
                            <div className={stakeType.Stakes.length > 3 ? "full-block" : "short-block"}
                                 key={sti + '-wrapper'}>
                                <p key={sti} className="factor-block-heading">{stakeType.N}
                                    <small className="dev-code">[{stakeType.Id} / {stakeType.Stakes.length}]</small>
                                </p>
                                <div key={sti + '-stakes'}>{stakeType.Stakes.map((stake, si) => (
                                    <span key={si} title={stake.SFN} className="factor-block"><span
                                        className="factor-name">{stake.N} {stake.A !== null && `(${stake.A})`}</span> - <Factor
                                        factor={stake.F}/> </span>
                                ))}</div>
                            </div>)) : <p>Ставки временно не принимаются</p>}
                    </div>
                ))
                }</div>
            ]
        } else {
            display = <div className="screenLogo" key="display"><img src={this.props.logo} alt="r-bet logo"/></div>
        }
        return [display, <div className="clearing" key="clearing"></div>]
    }
}