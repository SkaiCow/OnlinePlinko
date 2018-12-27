var Matter = require('matter-js');
var GameUtility = require('../utility/GameUtil');

//var scoreList = ["","","","","","","","","","","","","","","","","","","","",""];
var scoreList = ["100","100","100","100","100","100","100","100","100","100","100","100","100","100","100","100","100","100","100","100","100","100","100"];
var playerScores = {};
var gameTax = .15;
var flatRate = 100;
var startingMoney = 300;

var Engine = Matter.Engine,
		World = Matter.World,
		Bodies = Matter.Bodies,
		Body = Matter.Body,
		Composite = Matter.Composite,
		Bounds = Matter.Bounds;
var plinkoEngine;
var plinkoWorld;

module.exports = class GameManager
{
	static BuildGame()
	{
		var engOptions = {};
		plinkoEngine = Engine.create(engOptions);
		plinkoEngine.timing.timeScale = 1;

		plinkoWorld = plinkoEngine.world;
		plinkoWorld.gravity.y = .75;
		World.add(plinkoWorld, buildWorld());
		scoreList.forEach(function(spot,i){
			var rand = Math.random();
			if(rand < .40)
				scoreList[i] = "100";
			else if(rand < .60)
				scoreList[i] = "0";
			else if(rand < .85)
				scoreList[i] = "200";
			else if(rand < .95)
				scoreList[i] = "300";
			else
				scoreList[i] = "500";
		});
		setInterval(function() {
			Engine.update(plinkoEngine, 1000 / 60);
			sendAllObjects(Composite.allBodies(plinkoWorld));
			checkBallScore(plinkoEngine.pairs.collisionStart,plinkoEngine.pairs.collisionActive,plinkoEngine.pairs.collisionEnd);
		}, 1000 / 60);
	}



	static sendColor(client)
	{
		client.emit('game',{type:'color', color:client.color});
	}

	static dropBall(msg,client)
	{
		var options = {friction:0,restitution:.8};
		var ball = Bodies.circle(msg.x,msg.y,8,options);
		ball.label = "ball";
		ball.playerID = client.id;
		ball.color = client.color;
		ball.tag = "ball";
		World.add(plinkoWorld, ball);
		updateMyScore(client.id,-1);
	}

	static sendScoreList()
	{
		client.emit('game',{type:'scoreList', list:scoreList});
	}

	static addPlayer(client)
	{
		playerScores[client.id] = startingMoney;
	}
}

// TODO:
//subtract score when dropping ball
//

function updateMyScore(clientID, sco)
{
	var num;
	if(sco == -1)
	{
		//this means they droped a ball, can be changed to set amounts if we want to
		var moneyLose = playerScores[clientID] * gameTax + flatRate;
		//we can make a if statment here to check for enough money
		num = playerScores[clientID] - moneyLose;
	}
	else
	{
		//add to score
		num = playerScores[clientID] + sco;
	}
	playerScores[clientID] = Math.round(num*100)/100
	console.log("a player has a new score: " + playerScores[clientID]+"\nhe scored a "+sco);
	//io.emit('game',{type:'score', id:clientID, score:playersScores[clientID]});
}

function sendAllObjects(allBodies)
{
	var clients = SystemManager.getAllUsers();
	if(clients.length > 1)
	{
		var allObjects = [];
		allBodies.forEach(function(body, i){
			switch(body.tag)
			{
				case 'Circle Body':
					var object = {
						type: body.tag,
						x:body.position.x,
						y:body.position.y,
						radius: body.circleRadius,
						rotation: body.angle
					};
					allObjects.push(object);
				break;
				case 'Rectangle Body':
					var object = {
						type: body.tag,
						x:body.position.x,
						y:body.position.y,
						width: body.bounds.max.x - body.bounds.min.x,
						height: body.bounds.max.y - body.bounds.min.y,
						rotation: body.angle
					};
					allObjects.push(object);
				break;
				case 'ball':
					var object = {
						type: body.tag,
						x:body.position.x,
						y:body.position.y,
						radius: body.circleRadius,
						rotation: body.angle,
						color: body.color
					};
					allObjects.push(object);
				break;
			}
		});
		io.emit('game',{type:'objects', values:allObjects, score:scoreList});
	}
}

function buildWorld()
{
	//make objects of options for presets
	var staticBody = {isStatic:true,friction:0,restitution:.8,tag:"Rectangle Body"};
	var staticPed = {isStatic:true,friction:0,restitution:.8,tag:"Circle Body"};
	//write all matter js bodies here
	var allBodies = [];
	//borders
	allBodies.push(Bodies.rectangle(-390,10,20,700,staticBody));
	var bottomTrigger = Bodies.rectangle(0,350,800,20,staticBody);
	bottomTrigger.label = "bottomTrigger";
	allBodies.push(bottomTrigger);
	allBodies.push(Bodies.rectangle(390,10,20,700,staticBody));
	//pegs
	var horSpacing = 30.4;
	var verSpacing = 55;
	for(var y = 0; y < 10; y++)
	{
		var num = y%2==0?26:23;
		for(var x = 0; x < num; x++)
		{
			if(y%2==0)
			{
				if(x==0||x==num-1)
				{
					var body = Bodies.rectangle(-380+(horSpacing*x),-250+(verSpacing*y),15,15,staticBody);
					Body.rotate(body, 45);
					allBodies.push(body);
				}
				else
				{
					allBodies.push(Bodies.circle(-380+(horSpacing*x),-250+(verSpacing*y),5,staticPed));
				}
			}
			else
			{
				allBodies.push(Bodies.circle(-333+(horSpacing*x),-250+(verSpacing*y),5,staticPed));
			}
		}
	}
	//pockets
	for(var i = 0; i<24; i++)
	{
		allBodies.push(Bodies.rectangle(-348+(horSpacing*i),320,5,50,staticBody));
	}
	return allBodies;
}

function checkBallScore(collisionStart,collisions,collisionEnd)
{
	if(collisionStart.length > 0)
	{
		collisionStart.forEach(function(collidePoint, i){
			//write all collision start coditions here
			if(collidePoint.bodyA.label == "bottomTrigger" && collidePoint.bodyB.label == "ball")
			{
				var pocketNum = Math.floor((collidePoint.bodyB.position.x+348)/30.4);
				if(pocketNum<0||pocketNum>22)
				{
					updateMyScore(collidePoint.bodyB.playerID,0);
				}
				else
				{
					updateMyScore(collidePoint.bodyB.playerID,parseInt(scoreList[pocketNum]));
					io.emit('score',{type:'scored',slot:pocketNum});
				}
				World.remove(plinkoWorld,collidePoint.bodyB);
			}
		});
	}
	if(collisions.length > 0)
	{
		collisions.forEach(function(collidePoint, i){
			//write all collision codition here
		});
	}
}
