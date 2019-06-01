var mysql = require('mysql');
var ApiService = require('../services/service.js');

var UIRoutes = function(app) {
    this.app = app;
    this.apiServiceInstance = new ApiService(app);
};


module.exports    = UIRoutes;
UIRoutes.prototype.init = function() {
    var self = this;
    var app = this.app;
    var userId = '',
    initialUserName = '',
    initialAge = '',
    initialAddress = ''

    app.get("",function (req,res) {
        res.render("../www/login.html");
        res.end();

    });

   app.post('/login',function(req, res){

      sql = 'select * from userInfo where emailId = '+ mysql.escape(req.body.emailId) + 'and pswd = '+ mysql.escape(req.body.password)

      self.apiServiceInstance.operation(sql, function (err, result) {
        if (err) throw err;

        if (result.length == 1){

          userId = req.body.emailId
          initialUserName = result[0].username
          initialAge = result[0].Age
          initialAddress = result[0].Address
          result[0].DOB = result[0].DOB.toISOString()
          result[0].createdAt = result[0].createdAt.toISOString()
          result[0].updatedAt = result[0].updatedAt.toISOString()
          res.render("../www/edit.ejs",{ contacts: result });

        }
        else{
          res.send("Login Error")
        }

    });
      
   });

   app.post('/register',function(req, res){

      var info = req.body;
      var d = new Date();
      var date = new Date(d + 'UTC');
      currentTime = date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
      var values = [
                  [info.username,info.emailId,info.password,info.Age,info.Address,info.DOB,currentTime,currentTime]
                ];

      sql = 'INSERT INTO userInfo (username,emailId,pswd,Age,Address,DOB,createdAt,updatedAt) VALUES ?'

      self.apiServiceInstance.insert(sql,values, function (err, result) {
        if (err) 
        {
          if (err.code == 'ER_DUP_ENTRY'){
            res.send("Email Id already Registered, Please Try another")
          }
          else{
            throw err;
          }
        }
        else
        {
          if (result.affectedRows >= 1){
            res.render("../www/login.html");
            res.end();
          }
          else{
            res.send("Insertion Error")
          }
        }
    });
   });

   app.post('/updateuser',function(req, res){

      if (req.body.username != undefined && req.body.username != '' ){
        username = req.body.username
        initialUserName = username
      }
      else{
        username = initialUserName
      }

      if (req.body.Age != undefined && req.body.Age != ''){
        age = req.body.Age
        initialAge = age
      }
      else{
        age = initialAge
      }

      if (req.body.Address != undefined && req.body.Address != '' ){
        address = req.body.Address
        initialAddress = address
      }
      else{
        address = initialAddress
      }

      var d = new Date();
      var date = new Date(d + 'UTC');
      currentTime = date.toISOString().replace(/T/, ' ').replace(/\..+/, '')

      sql = 'UPDATE userInfo SET username = '+ mysql.escape(username) +', Age = '+ mysql.escape(age) +', Address = '+ mysql.escape(address)+', updatedAt = '+ mysql.escape(currentTime) +' WHERE emailId = '+ mysql.escape(userId)

      self.apiServiceInstance.operation(sql, function (err, result) {
        if (err) throw err;

        if (result.affectedRows >= 1){
            res.send('user details updaed; just goback and refresh the page')
        }
        else{
          res.send("Email Id doesn't exist")
        }
      });
   });

   app.get('/removeuser',function(req, res){
      
      sql = 'delete from userInfo where emailId = '+ mysql.escape(userId)

      self.apiServiceInstance.operation(sql, function (err, result) {
        if (err) throw err;

        if (result.affectedRows >= 1){
            res.render("../www/login.html")
        }
        else{
          res.send("Email Id doesn't exist")
        }
      });
   });

};
