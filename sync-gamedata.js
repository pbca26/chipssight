/*
 * Usage: node sync-gamedata.js or add it as a cron script
 */

var fs = require('fs');

var logger = {
  debug: console.log,
};
var ChipsGameDataDb = function() {
  this.data = {};
};

ChipsGameDataDb.prototype.sync = function() {
  var self = this;
  var stdout = '';
  var cp = require('child_process');
  var ls = cp.spawn('chips-cli', ['listtransactions', 'dev-address', 9999999, 0, true]);
  
  logger.debug('game');
  ls.stdout.setEncoding('utf8');
  ls.stdout.on('data', function(data) {
    logger.debug('stdout:', data);
    stdout += data;
  });
  
  ls.stderr.on('data', function(data) {
    logger.debug('stderr', data);
  });
  
  ls.on('close', function(code) {
    try {
      var txs = JSON.parse(stdout);
      logger.debug(txs.length);
      logger.debug('call game2');

      for (var i = 0; i < txs.length; i++) {
        logger.debug(i, 'txid', txs[i].txid);
        self.extractTxData(txs[i].txid);
      }
    } catch(e) {}
    logger.debug('sync child process exited with code', code);
  });
}
    
ChipsGameDataDb.prototype.extractTxData = function(txid) {
  var self = this;
  var stdout = '';
  var cp = require('child_process');
  var ls = cp.spawn('./privatebet/bet', ['extract_tx_data', txid]);
  
  logger.debug('game2', txid);
  ls.stdout.setEncoding('utf8');
  ls.stdout.on('data', function(data) {
    logger.debug('stdout:', data);
    stdout += data;
  });

  ls.stderr.on('data', function(data) {
    logger.debug('stderr', data);
  });
  
  ls.on('close', function(code) {
    //stdout = stdout.replace(/\t/g, '').replace(/\n/g, '');
    var temp = stdout.split('Data part of tx');
    logger.debug('bet extract_tx_data', txid);
    logger.debug(stdout.split('Data part of tx'));
    // skip malformed transactions
    try {
      logger.debug(stdout);
      logger.debug(JSON.parse(temp[1]));
      if (txid.length === 64) {
        self.data[txid] = JSON.parse(temp[1]);
        fs.writeFileSync('./gamedata.json', JSON.stringify(self.data));
      }
      logger.debug('extractTxData child process exited with code', code);
    } catch (e) {}
  });
}

var cdb = new ChipsGameDataDb();
cdb.sync();