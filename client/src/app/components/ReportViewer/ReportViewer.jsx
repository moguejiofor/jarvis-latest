import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import FlipMove from 'react-flip-move';
import FB from 'styles/flexbox';
let agent = require('superagent-promise')(require('superagent'), Promise);

import moment from 'moment';

import HotFilesInRepo from './Reports/HotFilesInRepo'
import HotUrlsInRepo from './Reports/HotUrlsInRepo'
import ResourcesByOtherUsers from './Reports/ResourcesByOtherUsers'
import SuggestedTeamMembers from './Reports/SuggestedTeamMembers'



class ReportViewer extends Component {
  constructor(...args) {
    super(...args);
  }

  static get propTypes() {
    return {

    }
  }


  render() {
    let report = this.props.report;

    let data = report.data;
    let ReportComponent;

    let momentText = moment(report.timestamp).fromNow();

    switch (report.reportComponent){
      case 'HotFilesInRepo':
        ReportComponent = <HotFilesInRepo />
      break;
      case 'HotUrlsInRepo':
        ReportComponent = <HotUrlsInRepo />
      break;
      case 'ResourcesByOtherUsers':
        ReportComponent = <ResourcesByOtherUsers />
      break;
      case 'SuggestedTeamMembers':
        ReportComponent = <SuggestedTeamMembers />
      break;
    }


    return (


      <Card style={{'margin': 10, ...styles.reportCard}}>
        {/*<CardHeader
          title={report.title}
          subtitle={report.subtitle}
          actAsExpander={true}
          showExpandableButton={true}
          style={{}}
        />*/}

        <div style={{...styles.reportCardHeader}}>
          <div style={{...styles.reportCardTitle}}>
            {report.title}
          </div>
          <div style={{...styles.reportCardSubtitle}}>
            {report.subtitle}
          </div>

        </div>

        <div style={{...styles.reportContent}}>
          {ReportComponent}
        </div>


        {/*<div style={{"padding" : 10, "fontSize": 10, "color": "grey"}}>
          {momentText} { report.timestamp }
        </div>*/}
      </Card>


    );
  }
}

const styles = {
  reportCard: {
    backgroundColor: 'rgb(98, 102, 112)',
    color: 'white',
    fontFamily: '"Lucida Grande", "Segoe UI", Ubuntu, Cantarell, sans-serif',
  },
  reportCardHeader: {
    padding: '10'
  },
  reportCardTitle: {
    fontSize: '14',
    marginBottom: '5'

  },
  reportCardSubtitle: {
    fontSize: '10',
    color: '#cacaca'

  },
  reportContent:{
    padding: '10'
  }

}




export default ReportViewer;
