var Matter = require('matter-js');

var gameTax = .15;
var flatRate = 100;

var Engine = Matter.Engine,
		World = Matter.World,
		Bodies = Matter.Bodies;
		Body = Matter.Body
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
		var options = {friction:0,restitution:.8};
		var ball = Bodies.circle(msg.x,msg.y,8,options);
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
	var staticBody = {isStatic:true,friction:0,restitution:.8};
	//write all matter js bodies here
	var allBodies = [];
	allBodies.push(Bodies.rectangle(0,350,800,20,staticBody));
	allBodies.push(Bodies.rectangle(-390,10,20,700,staticBody));
	allBodies.push(Bodies.rectangle(390,10,20,700,staticBody));

	var horSpacing = 31;
	var verSpacing = 55;
	for(var y = 0; y < 10; y++)
	{
		for(var x = 0; x < 25; x++)
		{
			if(y%2==0)
			{
				if(x==24)
				{
					var body = Bodies.rectangle(-363+(horSpacing*x),-250+(verSpacing*y),10,10,{isStatic:true,friction:0,restitution:.8,rotation:45});
					Body.rotate(body,45)
					allBodies.push(body);
				}
				else
				{
					allBodies.push(Bodies.circle(-363+(horSpacing*x),-250+(verSpacing*y),5,staticBody));
				}
			}
			else
			{
				if(x==0)
				{
					var body = Bodies.rectangle(-380+(horSpacing*x),-250+(verSpacing*y),10,10,{isStatic:true,friction:0,restitution:.8,rotation:45});
					Body.rotate(body,45)
					allBodies.push(body);
				}
				else
				{
					allBodies.push(Bodies.circle(-380+(horSpacing*x),-250+(verSpacing*y),5,staticBody));
				}
			}
		}
	}

	World.add(plinkoWorld, allBodies);
}
