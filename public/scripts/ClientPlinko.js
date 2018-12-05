var lastWindowHeight;

//this variable gets updated by the server
var serverBalls = [];
var myColor;
var scoreBoard = [];

//groups of sprites that are your balls and other peoples balls
var yourBalls;
var theirBalls;

//singal map elements that probably dont need to be here.
var pegs;
var pockets;
var dropStart;
var dropEnd;

var lastDrop = [];

//images
var ballImage;
var point100Image;
var point200Image;
var point300Image;
var point500Image;
var point0Image;

//options: 100, 200, 300, 500, 0
//var pointSlots = ["100","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"];
var pointSlots = ["100","0","100","200","0","300","100","0","500","0","100","300","0","200","100","0","100"];
var gravity = .1;

function preload()
{
	yourBalls = new Group();
	theirBalls = new Group();
	pegs = new Group();
	pockets = new Group();

	ballImage = loadImage("/images/ball.png");
	point100Image = loadImage("/images/points-100.png");
	point200Image = loadImage("/images/points-200.png");
	point300Image = loadImage("/images/points-300.png");
	point500Image = loadImage("/images/points-500.png");
	point0Image = loadImage("/images/points-0.png");
}

function setup()
{
	createCanvas(windowWidth, windowHeight);
	lastWindowHeight = windowHeight;

	var backBoard = createSprite(8,0,1065,815);
	backBoard.shapeColor = color(50, 200, 100);


	for(var rows=0; rows<8; rows++)
	{
		for(var numpeg=0; numpeg < 20; numpeg++)
		{
			if(rows%2 == 0)
				var peg = createSprite(-515+numpeg*55,-250+rows*75,15,15);
			else
				var peg = createSprite(-490+numpeg*55,-250+rows*75,15,15);
			peg.setCollider('circle',0,0,10);
			peg.rotation = 45;
			peg.immovable = true;
			peg.shapeColor = color(75, 75, 75);
			//peg.debug = true;
			pegs.add(peg);
		}
	}

	for(var barnum=0; barnum<18; barnum++)
	{
		var bar = createSprite(-460+barnum*55,370,10,75);
		bar.shapeColor = color(75, 75, 75);
		bar.setCollider('rectangle',0,0,10,75);
		bar.immovable = true;
		//bar.debug = true;
		pockets.add(bar);
	}
	var Wall = createSprite(-534,10,20,835);
	Wall.shapeColor = color(100, 100, 100);
	Wall.setCollider('rectangle',0,0,Wall.width,Wall.height);
	Wall.immovable = true;
	pockets.add(Wall);
	Wall = createSprite(550,0,20,815);
	Wall.shapeColor = color(55, 55, 55);
	Wall.setCollider('rectangle',0,0,Wall.width,Wall.height);
	Wall.immovable = true;
	pockets.add(Wall);
	Wall = createSprite(18,417,1085,20);
	Wall.shapeColor = color(55, 55, 55);
	Wall.setCollider('rectangle',0,0,Wall.width,Wall.height);
	Wall.immovable = true;
	pockets.add(Wall);

	dropStart = createSprite(8,-348,1040,120);
	dropStart.shapeColor = color('rgba(0,0,0,0)');

	dropEnd = createSprite(7,370,1065,75);
	dropEnd.draw = function(){
		for(var spot=0; spot<pointSlots.length; spot++)
		{
			switch(pointSlots[spot])
			{
				case '0':image(point0Image,-439+55*spot,0,46,73);
				break;
				case '100':image(point100Image,-439+55*spot,0,46,73);
				break;
				case '200':image(point200Image,-439+55*spot,0,46,73);
				break;
				case '300':image(point300Image,-439+55*spot,0,46,73);
				break;
				case '500':image(point500Image,-439+55*spot,0,46,73);
				break;
			}
		}
		image(point0Image,-500,0,55,73);
		image(point0Image,500,0,55,73);
	};
	dropEnd.setCollider('rectangle',0,dropEnd.height/2,dropEnd.width,15);
	//dropEnd.debug = true;

	useQuadTree(true);

	setCamera(0,0,.8);
	setInterval(function(){
		sendBallsToServer(yourBalls);
	}, 10);
	window.onunload = popup;
}


function popup() {
	var empty = new Group();
	sendBallsToServer(empty);
  alert('tab changed');
}

function draw()
{
	background(75, 75, 75);

	for(var i=0; i<yourBalls.length; i++)
	{
		yourBalls.get(i).addSpeed(gravity,90);
	}
	for(var i=0; i<theirBalls.length; i++)
	{
		theirBalls.get(i).addSpeed(gravity,90);
	}

	yourBalls.bounce(pegs);
	yourBalls.bounce(yourBalls);
	yourBalls.bounce(pockets);
	yourBalls.overlap(dropEnd,function(){
		scoreBall(this);
		this.remove();
	});
	theirBalls.bounce(pegs);
	theirBalls.bounce(yourBalls);
	theirBalls.bounce(pockets);
	theirBalls.overlap(dropEnd,function(){
		this.remove();
	});

	//draw score board
	scoreBoard.forEach(function(player, i){
		push();
			translate(-740,-350+50*i);
			fill(myColor[0],myColor[1],myColor[2]);
			rect(0,0,200,50,10);
			fill(255,255,255);
			textSize(20);
			textAlign(LEFT,TOP);
			textStyle(BOLD);
			text('SkaiCow',10,4);
			text("Score: "+player.score,10,25);
		pop();
	});


	drawSprites();
}

function addball(x,y,velocityX,velocityY,color)
{
	var ball = createSprite(x,y,50,50);
	ball.draw = function()
	{
		push();
			fill(color[0],color[1],color[2]);
			ellipse(0, 0, 275);
		pop();
		image(ballImage,0,0);
	};
	ball.scale = .1;
	ball.mass = ball.scale;
	ball.restitution = .74;
	ball.setCollider('circle', 0, 0, 120);
	ball.setVelocity(velocityX,velocityY);
	//ball.debug = true;
	theirBalls.add(ball);
}

function loadOtherBalls(balls)
{
	for(var i=0; i<balls.length; i++)
	{
		if(i < theirBalls.length)
		{
			var ball = theirBalls.get(i);
			ball.position.x = balls[i].x;
			ball.position.y = balls[i].y;
			ball.setVelocity(balls[i].velocityX,balls[i].velocityY);
		}
		else
		{
			addball(balls[i].x,balls[i].y,balls[i].velocityX,balls[i].velocityY,balls[i].color);
		}
	}
}

function sendBallsToServer(list)
{
	var myBalls = [];
	for(var i=0; i < list.length; i++)
	{
		myBalls.push({x:list.get(i).position.x, y:list.get(i).position.y ,velocityX:list.get(i).velocity.x, velocityY:list.get(i).velocity.y});
	}
	io.emit('game',{type:'physics', values:myBalls});
}

//a p5js function
function mouseClicked()
{
	checkForDrop();
}

function checkForDrop()
{
	if(camera.mouseX/camera.zoom != lastDrop[0] || camera.mouseY/camera.zoom != lastDrop[1])
	{
		if(camera.mouseX/camera.zoom >= dropStart.position.x - dropStart.width/2 && camera.mouseX/camera.zoom <= dropStart.position.x + dropStart.width/2)
		{
			if(camera.mouseY/camera.zoom >= dropStart.position.y - dropStart.height/2 && camera.mouseY/camera.zoom <= dropStart.position.y + dropStart.height/2)
			{
				dropBall();
				io.emit('game',{type:'score',value:-1});
				lastDrop = [camera.mouseX/camera.zoom,camera.mouseY/camera.zoom];
			}
		}
	}
}

function dropBall()
{
	var ball = createSprite((camera.mouseX/camera.zoom),(camera.mouseY/camera.zoom),50,50);
	ball.draw = function()
	{
		push();
			fill(myColor[0],myColor[1],myColor[2]);
			ellipse(0, 0, 275);
		pop();
		image(ballImage,0,0);
	};
	ball.scale = .1;
	ball.mass = ball.scale;
	ball.restitution = .74;
	ball.setCollider('circle', 0, 0, 120);
	//ball.debug = true;
	yourBalls.add(ball);
}

function scoreBall(ball)
{
	var scorePos = Math.floor((ball.position.x + 460)/55);
	switch(pointSlots[scorePos])
	{
		case "100":io.emit('game',{type:'score',value:100});
		break;
		case "200":io.emit('game',{type:'score',value:200});
		break;
		case "300":io.emit('game',{type:'score',value:300});
		break;
		case "500":io.emit('game',{type:'score',value:500});
		break;
	}
}

function myServerColor(msg)
{
	myColor = msg.color;
}

function updateScore(msg)
{
	var found = false;
	scoreBoard.forEach(function(player){
		if(player.id == msg.player)
		{
			player.score = msg.score.toFixed(2);
			found = true;
		}
	});
	if(!found)
		scoreBoard.push({id:msg.player,score:msg.score.toFixed(2)});
}

function setCamera(x,y,zoom)
{
	camera.position.x = x+.001;
	camera.position.y = y+.001;
	camera.zoom = zoom;
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
	camera.zoom = (windowHeight * camera.zoom)/lastWindowHeight;
	lastWindowHeight = windowHeight;
}
