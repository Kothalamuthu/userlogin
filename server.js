var  express = require ('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');


var port = 8001;
app.listen (port,function () {
    console.log('server running on http://localhost:'+port)

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/www'));


// Setting here what we want to show from www folder
// app.set('views',__dirname + '/www/app/views');
// app.set('www',__dirname + '/www/app/views');

// // setting the view engine to html


app.engine('html',require('ejs').renderFile);

// app.set('viewEngine','html');


var WebRoutes = require("./routes/ui-routes.js");
var webRoutes = new WebRoutes(app);
webRoutes.init();
