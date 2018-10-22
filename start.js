
SocialManager = require("./managers/SocialManager");
MessangerManager = require("./managers/MessangerManager");
SystemManager = require("./managers/SystemManager");
GameManager = require("./managers/GameManager");

var http = require('http');
var Express = require('express');
var bodyParser = require('body-parser');
var app = Express();


app.use(Express.static('./public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('view engine', 'ejs');

app.use(function(error, req, res, next) {
	console.log(error);
	ErrorController.code500(req, res);
});

app.get('/', function(req, res) {
	res.render('LoginView');
});

var server = http.createServer(app);

server.listen(80, function()
{
	console.log((new Date()) + ' Server is listening');
});

//Websocket

io = require('socket.io')(server);

setInterval(function(){
	GameManager.updateAllBalls();
}, 50);

io.on('connection', function(client)
{
  console.log('Connection accepted.');
	client.color = SystemManager.getRandColor();
	SystemManager.addConnection(client);
	SystemManager.updateUser(client);
	GameManager.sendColor(client)
	//handle how messages come in
	client.on('message', function(msg)
	{
   	//send chat messages to where they need to be
  });
	client.on('system', function(msg){
		console.log(msg);
		command = msg.split(" ");
		switch(command[0])
		{
			case '/backcolor': SystemManager.changeBackColor(command[1]);
			break;
		}
	});

	client.on('game',function(msg){
		switch(msg.type)
		{
			case 'physics': GameManager.updateMyBalls(client.id,msg.values,client.color);
			break;
		}
	});

  client.on('close', function(reasonCode, description)
	{
   	console.log((new Date()) + ' Peer disconnected.');
  });
});
