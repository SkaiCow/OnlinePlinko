var Matter = require('matter-js');

var gameTax = .15;
var flatRate = 100;

var Engine = Matter.Engine,
		World = Matter.World,
		Bodies = Matter.Bodies;
		Composite = Matter.Composite;
var plinkoWorld;

module.exports = class GameManager
{
	static BuildGame()
	{
		var engOptions = {};
		var plinkoEngine = Engine.create(engOptions);
		plinkoEngine.timing.timeScale = 1;
		plinkoWorld = plinkoEngine.world;
		buildWorld();
		setInterval(function() {
			Engine.update(plinkoEngine, 1000 / 60);
			sendAllBalls();
		}, 1000 / 60);
	}

	static updateMyScore(clientID, sco)
	{
		if(sco == -1)
		{
			//this means they droped a ball, can be changed to set amounts if we want to
			var moneyLose = scoreList[clientID] * gameTax + flatRate;
			//we can make an if statment here to check for enough money
			scoreList[clientID] = scoreList[clientID] - moneyLose;
		}
		else
		{
			//add to score
			scoreList[clientID] = scoreList[clientID] + sco;
		}
		io.emit('game',{type:'score', id:clientID, score:scoreList[clientID]});
	}

	static sendColor(client)
	{
		client.emit('game',{type:'color', color:client.color});
	}

	static dropBall(msg)
	{
		var options = {friction:0,restitution:.9};
		var ball = Bodies.circle(msg.x,msg.y,10,options);
		ball.rotation = 90;
		World.add(plinkoWorld, ball);
	}
}

function sendAllBalls()
{
	var clients = SystemManager.getAllUsers();
	if(clients.length > 1)
	{
		var allBalls = [];
		Composite.allBodies(plinkoWorld).forEach(function(body, i){
			switch(body.label)
			{
				case 'Circle Body':
					var object = {
						type: body.label,
						x:body.position.x,
						y:body.position.y,
						radius: body.circleRadius,
						rotation: body.angle
					};
					allBalls.push(object);
				break;
				case 'Rectangle Body':
					var object = {
						type: body.label,
						x:body.position.x,
						y:body.position.y,
						width: body.bounds.max.x - body.bounds.min.x,
						height: body.bounds.max.y - body.bounds.min.y,
						rotation: body.angle
					};
					allBalls.push(object);
				break;
			}
		});
		io.emit('game',{type:'balls', values:allBalls});
	}
}

function buildWorld()
{
	//make objects of options for presets
	var staticBody = {isStatic:true,friction:0,restitution:.9};
	//write all matter js bodies here
	var allBodies = [];
	allBodies.push(Bodies.circle(0,0,50));
	allBodies.push(Bodies.rectangle(0,200,500,50,staticBody));
	World.add(plinkoWorld, allBodies);
}
