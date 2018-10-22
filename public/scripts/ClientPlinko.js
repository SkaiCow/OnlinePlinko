var lastWindowHeight;

//this variable gets updated by the server
var serverBalls = [];
var myColor;

//groups of sprites that are your balls and other peoples balls
var yourBalls;
var theirBalls;

//singal map elements that probably dont need to be here.
var pegs;
var pockets;
var dropStart;
var dropEnd;

var lastDrop = [];
var ballImage;

var gravity = .1;

function preload()
{
	yourBalls = new Group();
	theirBalls = new Group();
	pegs = new Group();
	pockets = new Group();

	ballImage = loadImage("/images/ball.png");
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

	dropEnd = createSprite(8,410,1060,20);
	dropEnd.setCollider('rectangle',0,0,dropEnd.width,dropEnd.height);
	dropEnd.shapeColor = color('rgba(0,0,0,0)');
	//dropEnd.debug = true;

	setCamera(0,0,.8);

	setInterval(function(){
		sendBallsToServer();
	}, 10);
}

function draw()
{
	background(75, 75, 75);

	//gravity
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
		this.remove();
	});
	theirBalls.bounce(pegs);
	theirBalls.bounce(yourBalls);
	theirBalls.bounce(pockets);
	theirBalls.overlap(dropEnd,function(){
		this.remove();
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

function sendBallsToServer()
{
	var myBalls = [];
	for(var i=0; i < yourBalls.length; i++)
	{
		myBalls.push({x:yourBalls.get(i).position.x, y:yourBalls.get(i).position.y ,velocityX:yourBalls.get(i).velocity.x, velocityY:yourBalls.get(i).velocity.y});
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
				//sendBallsToServer();
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

function myServerColor(msg)
{
	myColor = msg.color;
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
