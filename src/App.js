import React, {Component} from 'react';
import Display from './Display';
import Settings from './Settings';
import logo from './svg/logo.svg';
import './App.css';

let webSocket;
let wsUri = 'wss://ws.rbet.kz';
const sType = {live: "live_sport", pre: "sport"};
const eType = {live: "live_event", pre: "event"};
const cType = {pre: "championship"};

class App extends Component {
    constructor() {
        super();
        this.state = {
            mode: null,
            sports: [],
            sType: null,
            champs: [],
            events: [],
            eType: null,
            selectedSport: null,
            selectedChampionship: null,
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

    updateChamps(data) {
        this.setState({champs: data})
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
            if (this.state.selectedEvent !== null) {
                webSocket.send(JSON.stringify({
                    action: 'subscribe',
                    objects: [
                        `${this.state.eType}:${this.state.selectedEvent}:${this.state.eType}:${this.state.langId}`
                    ]
                }));
            }
        };

        webSocket.onclose = (evt) => {
            console.log(new Date(), 'WS CLOSED');
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
                // console.log(dataType);
                // console.log(dataType[0].indexOf('sport') >= 0);
                dataType[0].indexOf('sport') >= 0 && this.updateSports(data.data.d);
                dataType[0].indexOf('championship') >= 0 && this.updateChamps(data.data.d);
                dataType[0].indexOf('event') >= 0 && dataType[2].indexOf('sport') >= 0 && this.updateEvents(data.data.d);
                dataType[0].indexOf('event') >= 0 && dataType[2].indexOf('championship') >= 0 && this.updateEvents(data.data.d);
                dataType[0].indexOf('event') >= 0 && dataType[2].indexOf('event') >= 0 && this.updateEventData(data.data.d);
            }
        };
        webSocket.onerror = (evt) => {
            console.log(new Date(), 'WS ERROR')
        };
    }

    showChamps(sportId) {
        if (this.state.selectedSport !== null) {
            this.subscribe('unsubscribe', [`${this.state.eType}:${this.state.selectedSport}:${this.state.sType}:${this.state.langId}`])
        }
        this.setState({selectedSport: sportId});
        this.subscribe('subscribe', [`${cType.pre}:${sportId}:${this.state.sType}:${this.state.langId}`]);
    }

    showEvents(sportId) {
        if (this.state.selectedSport !== null) {
            this.subscribe('unsubscribe', [`${this.state.eType}:${this.state.selectedSport}:${this.state.sType}:${this.state.langId}`])
        }
        this.setState({selectedSport: sportId});
        this.subscribe('subscribe', [`${this.state.eType}:${sportId}:${this.state.sType}:${this.state.langId}`]);
    }

    showEventsByChamp(champId) {
        if (this.state.selectedChampionship !== null) {
            this.subscribe('unsubscribe', [`${this.state.eType}:${this.state.selectedChampionship}:${cType.pre}:${this.state.langId}`])
        }
        this.setState({selectedChampionship: champId});
        this.subscribe('subscribe', [`${this.state.eType}:${champId}:${cType.pre}:${this.state.langId}`]);
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

    getLine() {
        this.setState({sType: sType.pre, eType: eType.pre}, () => {
            console.log("LINE");
            this.getSportList('line');
            //TODO unsubscribe trash
            //TODO subscribe line sport list
        });
    }

    getLive() {
        this.setState({sType: sType.live, eType: eType.live}, () => {
            console.log("LIVE");
            this.getSportList('live');
            //TODO unsubscribe trash
            //TODO subscribe live sport list
        });
    }

    getSportList(type) {
        let unset = [];
        let sports = type === 'line' ? 'live_sport:-1::1' : 'sport:-1::1';
        unset.push(sports);
        // event - champ
        // champ - sport
        if (type === 'live') {
            let champs = `championship:${this.state.selectedSport}:sport:1`;
            let events = `event:${this.state.selectedChampionship}:championship:1`;
            let event = `event:${this.state.selectedEvent}:event:1`;
            unset.push(champs, events, event);
            this.setState({mode: "LIVE"});
        } else {
            let events = `live_event:${this.state.selectedSport}:live_sport:1`;
            let event = `live_event:${this.state.selectedEvent}:live_event:1`;
            this.setState({mode: "ЛИНИЯ"});
            unset.push(events, event);
        }
        console.log(unset);
        this.subscribe('unsubscribe', unset);
        this.setState({champs: [], events: [], selectedSport: null}, () => {
            this.subscribe('subscribe', [`${this.state.sType}:-1::1`]);
        });
    }
    toggleScreen(){
        this.setState({screen:!this.state.screen});
    }

    render() {
        return (
            <div className="App">
                <Settings>
                    <p className="type-settings">
                        <button className={this.state.mode === 'ЛИНИЯ' ? "type-switch active" : "type-switch"}
                                onClick={() => {
                                    this.getLine()
                                }}>Линия
                        </button>
                        <button className={`` + this.state.mode === 'LIVE' ? "type-switch active" : "type-switch"}
                                onClick={() => {
                                    this.getLive()
                                }}>Live
                        </button>
                        <button className={this.state.screen ? "type-switch" : "type-switch active"}
                                onClick={() => {
                                    this.toggleScreen()
                                }}>Лого
                        </button>
                    </p>
                    <div className="sportsList">
                        {this.state.sports.length > 0 && this.state.sports.map((sport, i) => (<p className={this.state.selectedSport === sport.Id ? 'selected' : ''} onClick={() => {
                            this.state.sType === 'sport' ? this.showChamps(sport.Id) : this.showEvents(sport.Id)
                        }} key={i}>[<code>{sport.Id}</code>] <span
                            style={{cursor: "pointer"}}>{sport.N}</span> - <span>{sport.EC}</span></p>))}
                    </div>
                    {this.state.champs.length > 0 && <div className="champsList">
                        {this.state.champs.length > 0 && this.state.champs.map((country, i) => (
                            country.CL.map((champ, j) => (
                                <p className={this.state.selectedChampionship === champ.Id ? 'selected' : ''} onClick={() => {
                                    this.showEventsByChamp(champ.Id)
                                }} key={`${i}-${j}`}>[<code>{champ.Id}</code>] <span
                                    style={{cursor: "pointer"}}>{champ.N}</span> - <span>{champ.EC}</span></p>
                            ))
                        ))}
                    </div>}
                    <div className="eventsList">
                        {this.state.events.length > 0 && this.state.events.sort((a, b) => (a.Id > b.Id ? 1 : -1)).map((event, i) => (
                            <p className="event" key={i} onClick={() => {
                                this.showStakes(event.Id);
                            }}>[<code>{event.Id}</code>] <span>{event.N}</span></p>
                        ))}
                    </div>
                </Settings>
                <div className="eventDetails" style={{fontSize: this.state.fontSize + 'px'}}>
                    {this.state.selectedEvent && this.state.selectedEventData.length > 0 &&
                    <Display sport={this.state.sports.find((el) => (el.Id === this.state.selectedSport))} logo={logo}
                             screen={this.state.screen} data={this.state.selectedEventData}
                             eventId={this.state.selectedEvent} mode={this.state.mode}/>}
                </div>
                {!this.state.screen && <div className="screenLogo" key="display"><img src={logo} alt="r-bet logo" /></div>}
            </div>
        );
    }
}

export default App;