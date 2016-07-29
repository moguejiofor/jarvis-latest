import React from 'react';
import imm from 'immutable';
import Radium, { Style } from 'radium';
import { STYLES, COLORS } from '../styles';
import {mouseTrap} from 'react-mousetrap';
let Promise = require('promise');
let agent = require('superagent-promise')(require('superagent'), Promise);
import _ from 'lodash';
let eventTicker = [];
import {EventTickerItem} from './EventTicker';

class AtomView extends React.Component {
  constructor(){
    super();

    this.socket = window.socket;
    this.state = {
      eventTicker: [],
      items: []
    }

  }

  componentWillMount() {
    let self = this;
    this.socket.on('system-event', msg => {
      console.log('STATE', self.state);
      let eventTicker = self.state.eventTicker;

      eventTicker.unshift(msg);

      self.setState({
        eventTicker: eventTicker
      })
    })

  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  async handleEventTickerItemClick(nodeId){
    console.log('HEllo', nodeId);
    let result = await agent.post('http://localhost:3000/query', {nodeId:nodeId});

    this.setState({
      items: result.body
    })
  }

  render(){
    console.log('Items' , this.state.items);
    let queriedItems = this.state.items.map((item , index) => {
      let color = "rgba(80, 195, 210, 0.67)" ;
      let title = !_.isUndefined(item.endNode.title) ? item.endNode.title : item.endNode.address;

      return (
        <div style={{...LOCAL_STYLES.queriedItemsList, backgroundColor: color}}>
          {item.relationshipType} | {title} | {item.relationshipWeight}
        </div>
      )
    })

    return(
      <div style={{width: "100%"}}>

        <div style={LOCAL_STYLES.container}>
          <div style={LOCAL_STYLES.eventTickerList}>
            {this.state.eventTicker.map((item, index) => {
              let color = "rgba(80, 195, 210, 0.67)" ;

              if (index === 0) {
                color = "green"
              }
              else{
                let opacity = (100 - index * 9.90) / 100;
                color = "rgba(80, 195, 210, " + opacity + ")" ;
              }

              return (
                <EventTickerItem
                  key={index}
                  item={item}
                  onClick={this.handleEventTickerItemClick.bind(this)}
                  style={{...LOCAL_STYLES.eventTickerItem, backgroundColor: color}} />
              )
            })}
          </div>

          <div>
            {queriedItems}
          </div>
        </div>

      </div>
    )
  }
}

const FB = {
  base: { display: "flex" },
  direction: {
    row: { flexDirection: "row" },
    column: { flexDirection: "column" }
  },
  justify: {
    start: { justifyContent: "flex-start" },
    end: { justifyContent: "flex-end" },
    center: { justifyContent: "center" },
    between: { justifyContent: "space-between" },
    around: { justifyContent: "space-around" },
  }
}

const LOCAL_STYLES = {
  container: { fontFamily: "arial", height: "100vh", backgroundColor: "rgb(40, 44, 52)", },
  eventTickerList: { ...FB.base, ...FB.justify.start, minHeight: "100px", overflowY: "hidden", overflowX: "scroll", },
  __oldEventTickerItem: {width: "5vw", padding: "13px", margin: "10px", marginBottom: "15px", display: "inline-block",},
  eventTickerItem: { background: '#000', color: '#fff', padding: 10, margin: 10, display: "inline-block",},
  queriedItemsList: { width: "100%", padding: "20px", margin: "10px"},
  queriedItem: {},
};

export default mouseTrap(Radium(AtomView));
