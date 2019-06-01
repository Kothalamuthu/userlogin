var mysql = require('mysql');

var Service = function (app) {
    this.app = app;

};

module.exports = Service;

var con = mysql.createConnection({
  host: '127.0.0.1',
  user: "root",
  password: "w5rtc123",
  database: "user"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

Service.prototype.insert = function (sql,values,callback) {
    var self = this;

    con.query(sql,[values],function (err, result) {
    	if (err){
    		callback(err, null);
    	}
        else if (result) {
            callback(false, result);
        }
    });
};

Service.prototype.operation = function (sql,callback) {
    var self = this;

    con.query(sql, function (err, result) {
        if (result) {
            callback(false, result);
        }
    });
};