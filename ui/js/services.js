/**
 * Created by vignesh on 12/09/16.
 */
"use strict";


var app = angular.module('myApp');

/**
 * Socket Service
 */
app.service('Socket', ['$window', 'db', 'config', function ($window, db, config) {

  var socket = $window.io.connect(config.socket);

  socket.on('stat', (msg)=> {
    //console.info('Stat Received',msg);
    msg._id = msg.timestamp.toString();
    db.put(msg).then(()=> {
      //console.log('DB Updated');
    }).catch((err)=> {
      console.error('Error Occurred when adding log to db.', err,msg);

    });
  });

  socket.on('logs',(log)=>{
    //console.info(log);
    log.type = 'logstream';
    log._id = log.timestamp.toString();
    db.put(log).then().catch((err) => {
      console.error('Error Occurred when adding logstream to db.',err,log);
    })
  });

  return socket;
}]);

/**
 * Pouch Db Service
 */
app.service('db', ['$window', function ($window) {
  var db = new $window.PouchDB('logs', { auto_compaction: true });

  db.$init = function () {

    return db.allDocs().then((docs) => {
      console.log(docs);
      docs = docs.rows.map((item)=> {
        item._deleted = true;
        return item;
      });
      return db.bulkDocs(docs);
    }).catch((err)=>console.log(err));

  };

  return db;
}]);

app.service('google', ['$window', function($window) {
  return $window.google;
}]);