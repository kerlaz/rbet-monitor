import React, {Component} from 'react';
import Display from './Display';
import Settings from './Settings';
import logo from './svg/logo.svg';
import './App.css';

let webSocket;
let wsUri = 'wss://ws.rbet.kz';
const sType = {live:"sport",pre:"sport"};
const eType = {live:"championship",pre:"event"};

class App extends Component {
    constructor() {
        super();
        this.state = {
            sports: [],
            sType: sType.live,
            events: [],
            eType: eType.live,
            selectedSport: null,
            selectedEvent: null,
            selectedEventData: [],
            langId: 1,
            screen: true,
            fontSize: 16
        };
        window.subscribe = this.subscribe;
    }

    componentDidMount() {
        this.openConnection();
    }

    updateSports(data) {
        this.setState({sports: data});
    }

    updateEvents(data) {
        this.setState({events: data})
    }

    updateEventData(data) {
        this.setState({selectedEventData: data})
    }

    openConnection() {
        webSocket = new WebSocket(wsUri);
        webSocket.onopen = (evt) => {
            webSocket.send(JSON.stringify({
                action: 'subscribe',
                objects: [
                    `${this.state.sType}:-1::${this.state.langId}`,
                    `${this.state.eType}:${this.state.selectedSport}:${this.state.sType}:${this.state.langId}`
                    // `event:3530892:event:${this.state.langId}`
                ]
            }));
            if(this.state.selectedEvent !== null) {
                webSocket.send(JSON.stringify({
                    action: 'subscribe',
                    objects: [
                        `${this.state.eType}:${this.state.selectedEvent}:${this.state.eType}:${this.state.langId}`
                    ]
                }));
            }
        };

        webSocket.onclose = (evt) => {
            console.log(new Date(),'WS CLOSED');
            setTimeout(() => {
                this.openConnection()
            }, 2000);
        };
        webSocket.onmessage = (evt) => {
            let data;
            try {
                data = JSON.parse(evt.data);
            } catch (error) {
                data = false;
                console.log(error);
            }
            if (data && data.data !== null && data.data.d.length > 0) {
                let dataType = data.subscription.split(':');
                console.log(dataType);
                console.log(dataType[0].indexOf('sport') >= 0);
                dataType[0].indexOf('sport') >= 0 && this.updateSports(data.data.d);
                dataType[0].indexOf('championship') >= 0 && dataType[2].indexOf('sport') >= 0 && this.updateEvents(data.data.d);
                dataType[0] === ('live_event' || 'event') && dataType[2] === ('live_event' || 'event') && this.updateEventData(data.data.d);
            }
        };
        webSocket.onerror = (evt) => {
            console.log(new Date(),'WS ERROR')
        };
    }

    showEvents(sportId) {
        if (this.selectedSport !== null) {
            this.subscribe('unsubscribe', [`${this.state.eType}:${this.state.selectedSport}:${this.state.sType}:${this.state.langId}`])
        }
        this.setState({selectedSport: sportId});
        this.subscribe('subscribe', [`${this.state.eType}:${sportId}:${this.state.sType}:${this.state.langId}`]);
    }

    showStakes(eventId) {
        // console.log(eventId);
        if (this.state.selectedEvent !== null) {
            this.subscribe('unsubscribe', [`${this.state.eType}:${this.state.selectedEvent}:${this.state.eType}:${this.state.langId}`]);
        }
        this.setState({selectedEvent: eventId});
        this.subscribe('subscribe', [`${this.state.eType}:${eventId}:${this.state.eType}:${this.state.langId}`]);
    }

    static sendMessage() {
        console.log(webSocket);
        if (webSocket && webSocket.readyState === 1) {
            webSocket.send(JSON.stringify({
                action: 'subscribe',
                objects: [
                    "live_sport:-1::2"
                ]
            }))
        } else {
            console.log("WS is not open yet")
        }
    }

    closeConnection() {
        if (webSocket && webSocket.readyState === 1) webSocket.close();
    }

    testWs() {
        for (let i = 10; i > 0; i--) {
            webSocket.send(JSON.stringify({
                action: 'subscribe',
                objects: [
                    `live_sport:${i}:country:1`
                ]
            }));
        }
    }

    toggleLanguage() {
        let prevId, newId;
        if (this.state.langId === 1) {
            prevId = 1;
            newId = 2;
        } else {
            prevId = 2;
            newId = 1;
        }
        this.setState({langId: newId});
        let subSet = [
            `live_sport:-1::${newId}`,
            `live_event:${this.state.selectedSport}:live_sport:${newId}`,
            `live_event:${this.state.selectedEvent}:live_event:${newId}`
        ];
        this.subscribe('unsubscribe', [`live_sport:-1::${prevId}`]);
        this.subscribe('unsubscribe', [`live_event:${this.state.selectedSport}:live_sport:${prevId}`]);
        this.subscribe('unsubscribe', [`live_event:${this.state.selectedEvent}:live_event:${prevId}`]);
        this.subscribe('subscribe', subSet);
        // this.subscribe('subscribe',[`live_sport:-1::${newId}`]);
        // this.subscribe('subscribe',[`live_event:${this.state.selectedSport}:live_sport:${newId}`]);
        // this.subscribe('subscribe',[`live_event:${this.state.selectedEvent}:live_event:${newId}`]);
    }

    subscribe(action, subscriptionSet) {
        if (webSocket && webSocket.readyState === 1) {
            webSocket.send(JSON.stringify({
                action: action,
                objects: subscriptionSet
            }))
        }
    }

    render() {
        return (
            <div className="App">
                <Settings>
                    <p className="App-intro">
                        <button onClick={this.openConnection.bind(this)}>Connect</button>
                        <button onClick={this.closeConnection.bind(this)}>Disconnect</button>
                    </p>
                    <p>
                        <button onClick={()=>this.toggleLanguage()}>Toggle Language</button>
                    </p>
                    <div className="sportsList">
                        {this.state.sports.length > 0 && this.state.sports.map((sport, i) => (<p onClick={() => {
                            this.showEvents(sport.Id)
                        }} key={i}>[<code>{sport.Id}</code>] <span style={{cursor:"pointer"}}>{sport.N}</span> - <span>{sport.EC}</span></p>))}
                    </div>
                    <div className="eventsList">
                        {this.state.events.length > 0 && this.state.events.sort((a, b) => (a.Id > b.Id ? 1 : -1)).map((event, i) => (
                            <p className="event" key={i} onClick={() => {
                                this.showStakes(event.Id);
                            }}>[<code>{event.Id}</code>] <span>{event.N}</span> (<span>{event.ES}</span>) -
                                счет: <span>{event.SS}</span> - время: <span>{event.PT} минута</span></p>
                        ))}
                    </div>
                </Settings>
                <div className="eventDetails" style={{fontSize:this.state.fontSize+'px'}}>
                    {this.state.selectedEvent && this.state.selectedEventData.length > 0 &&
                    <Display sport={this.state.sports.find((el)=>(el.Id === this.state.selectedSport))} logo={logo} screen={this.state.screen} data={this.state.selectedEventData}
                             eventId={this.state.selectedEvent}/>}
                </div>
            </div>
        );
    }
}

export default App;