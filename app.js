
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');


var app = module.exports = express.createServer();
// socket.ioのインスタンス
var io = require('socket.io').listen(app);;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

// app.get('/', routes.index);
app.get('/paint', routes.paint);

app.get('/', function(req, res){
  res.render('index', {title: 'PaintChat'});
});


// portを追記
var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


// socket.io
io.sockets.on('connection', function (socket) {
 
    // クライアントからメッセージ受信
    socket.on('clear send', function () {
 
        // 自分以外の全員に送る
        socket.broadcast.emit('clear user');
    });
 
    // クライアントからメッセージ受信
    socket.on('server send', function (msg) {
 
        // 自分以外の全員に送る
        socket.broadcast.emit('send user', msg);
    });
 
    // 切断
    socket.on('disconnect', function () {
        io.sockets.emit('user disconnected');
    });
});

