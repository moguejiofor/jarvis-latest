import { Component } from 'react';
import layout from 'styles/layout';
import _ from 'lodash';
let agent = require('superagent-promise')(require('superagent'), Promise);
import {EventTickerList} from 'components/EventTicker';
import QueriedItemList from 'components/QueriedItemList';
import ViewWrapper from 'views/view-wrapper';
import FocusedItem from 'components/FocusedItem';
import imm from 'immutable';
import FB from 'styles/flexbox';
import RaisedButton from 'material-ui/RaisedButton';

class MainView extends Component {
  constructor(...args) {
    super(...args);
    this.socket = window.socket;

    this.state = {
      eventTickerItems: new imm.List(),
      users: new imm.List(),
      queriedItems: new imm.List(),
      teams: new imm.List(),
      filters: [
        { key: "", selected: true, label: "All" },
        { key: "files", selected: false, label: "Files" },
        { key: "urls", selected: false, label: "URLs" },
        { key: "keywords", selected: false, label: "Keywords" },
      ],
      params: {
        nodeId: -1,
        endNodeType: false,
        endUserNodeIds: false
      },
      latestItem: new imm.Map()
    }
  }

  async handleFilter(clickedFilter){
    let nodeId = this._focusedItem().get('id');
    let newParams = this.state.params;
    newParams.nodeId = nodeId;
    newParams.endNodeType = false;

    let oldFilters = this.state.filters;
    // let selectedFilter = this.state.filters.filter((filter) => filter.key = clickedFilter.key);
    let newFilters = this.state.filters.map((filter) => {
      if (filter.key === clickedFilter.key) {
        filter.selected = !filter.selected;
        if (filter.selected){
          switch (filter.key){
            case 'files':
              newParams.endNodeType = 'File';
              break;
            case 'urls':
              newParams.endNodeType =  'Url'
              break;
            case 'keywords':
              newParams.endNodeType =  'Keyword'
              break;
          }
        }
      }
      else{
        filter.selected = false
      }
      return filter
    })

    this.setState({
      filters: newFilters,
      params: newParams
    });
    this.query(newParams);

  }

  async query(params){
    let result = await agent.post('http://localhost:3000/query', params);
    let items = imm.fromJS(result.body);
    let focusedItem;

    //Keep the focused item in case query returns empty
    if (items.size > 0){
      focusedItem = items.getIn([0, 'startNode'], imm.Map());

    }
    else {
      focusedItem = this.state.latestItem;
    }

    this.setState({
      queriedItems: new imm.List()
    }, () => {
      this.setState({
        queriedItems: imm.fromJS(result.body),
        latestItem: focusedItem,
        focusedItem: focusedItem
      });
    });
  }

  async componentWillMount() {
    this.socket.on('system-event', msg => {
      this.setState({
        eventTickerItems: this.state.eventTickerItems.unshift(msg)
      });
    });

    let {userId, username} = localStorage;

    agent.post('http://localhost:3000/api/user/teams/members', { userId }).then((res) => {
      let users = new imm.List([{ id: userId, username }]);
      // TODO: add type/error checking
      users = users.concat(res.body);
      this.setState({ users });
    });

    agent.post('http://localhost:3000/api/user/teams', { userId }).then((res) => {
      this.setState({
        teams : imm.List(res.body)
      });
    });
  }

  async _handleEventTickerItemClick(nodeId) {
    let params = this.state.params;
    params.nodeId = nodeId;

    this.query(params);
  }

  _focusedItem() {
    return this.state.focusedItem;    
  }

  render() {

    let filters;
    if (this.state.eventTickerItems.size > 0){
      filters = <div style={LOCAL_STYLES.filterButtons}>
        {this.state.filters.map((filter, index) => {
          let zIndex = 5, selected;
          if (filter.selected) {
            zIndex = 0

          }
          return (
            <RaisedButton
              key={index}
              label={filter.label}
              primary={filter.selected}
              secondary={!filter.selected}
              zIndex={zIndex}
              onClick={()=>this.handleFilter(filter)}
              style={{flex: '1 1 auto', margin: 10}} />
          )
        })}
      </div>
    }
    else{
      filters = <div></div>
    }

    return (
      <ViewWrapper>
        <div style={layout.container}>

          <EventTickerList
            items={this.state.eventTickerItems}
            itemOnClick={this._handleEventTickerItemClick.bind(this)} />



          {filters}


          <FocusedItem item={this._focusedItem()} />



          <QueriedItemList
            items={this.state.queriedItems.toJS()}
            onClick={this._handleEventTickerItemClick.bind(this)} />
        </div>
      </ViewWrapper>
    );
  }
}

const LOCAL_STYLES = {
  container: {
    fontFamily: "arial",
    minHeight: "100vh",
    backgroundColor: "rgb(40, 44, 52)",
    color: '#fff',
    overflow: 'auto',
  },
  __oldEventTickerItem: {
    width: "5vw",
    padding: "13px",
    margin: "10px",
    marginBottom: "15px",
    display: "inline-block",
  },
  eventTickerItem: {
    minWidth: 100,
  },
  queriedItemsList: {
    padding: "20px",
    margin: "10px"
  },
  queriedItem: {},
  focusedItem: {
    margin: "10px",
    padding: "10px",
    color: "black"
  },
  filterButton: {
    ...FB.base,
    ...FB.justify.center,
    ...FB.flex.equal,
  },
  filterButtons: {
    ...FB.base,
    ...FB.justify.around,
  },
};

export default MainView;
