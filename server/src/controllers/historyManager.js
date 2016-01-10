// var thinky = require('thinky')();
//
// var type = thinky.type;
// console.log(thinky, type);


import Thinky from 'thinky'

var db = Thinky();
var type = db.type;

var Event = db.createModel("Event", {
  id: type.string(),
  timestamp: type.date(),
  source: type.string(),
  eventType: type.string(),
  data: type.object(),
  user: type.string()
})

class HistoryManager{
  constructor(userName){
    this.user = userName
  }

  saveEvent(event){
    console.log('!!!!----history', this.user);
    let ev = new Event({timestamp: new Date(), eventType: event.type, source: event.source, data: event.data, user:this.user})
    return ev.save()
  }
}

module.exports = HistoryManager;
