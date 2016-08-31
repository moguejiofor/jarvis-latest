import { Component } from 'react';
import FB from 'styles/flexbox';
import Navbar from '../navbar';
import ViewWrapper from 'views/view-wrapper';
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

let agent = require('superagent-promise')(require('superagent'), Promise);

class SetUserActivityManagerForm extends Component {
  constructor(...args){
     super(...args);


     this.state = {
       address: ''
     }

     this.init()
  }

  async init(){
      // let res = await agent.post('/api/user/getActivityManagerAddress');
      // let address = res.body;
      // this.setState({address})
  }

  updateActivityManagerAddress(e){
    let address = e.target.value;
    this.setState({
      address
    })
  }

  async saveActivityManagerAddress(){
    let {address} = this.state;
    let activityManager = await agent.post('/api/user/setActivityManagerAddress', {address});
  }

  render () {
    return (
      <div style={{margin: '10px'}}>
        <div>
          <TextField hintStyle={{color: 'white'}} textStyle={{color: 'white'}} hintText="Activity Manager Address" value={this.state.address} onChange={ this.updateActivityManagerAddress.bind(this) }/>
        </div>
        <div>
          <RaisedButton
            onClick={ () => this.saveActivityManagerAddress() }
            label={"Save"}
            primary={true}
            style={{flex: '1 1 auto', margin: 10}} />
        </div>
      </div>
    )
  }
}


export default SetUserActivityManagerForm
