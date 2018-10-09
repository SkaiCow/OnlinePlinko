var lastWindowHeight;

//this variable gets updated by the server
var serverBalls = [];

//groups of sprites that are your balls and other peoples balls
var yourBalls;
var theirBalls;

//singal map elements that probably dont need to be here.
var pegs;
var pockets;
var dropStart;
var dropEnd;

var lastDrop = [];

function preload()
{
	yourBalls = new Group();
	theirBalls = new Group();
	pegs = new Group();
	pockets = new Group();
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

	dropEnd = createSprite(8,400,1060,20);
	dropEnd.setCollider('rectangle',0,0,dropEnd.width,dropEnd.height);
	dropEnd.shapeColor = color('rgba(0,0,0,0)');
	//dropEnd.debug = true;

	setCamera(0,0,.8);
}

function draw()
{
	background(75, 75, 75);

	for(var i=0; i<yourBalls.length; i++)
	{
		yourBalls.get(i).addSpeed(.1,90);
	}
	for(var i=0; i<theirBalls.length; i++)
	{
		theirBalls.get(i).addSpeed(.1,90);
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

function addball(x,y,velocityX,velocityY)
{
	var ball = createSprite(x,y,50,50);
	ball.addImage(loadImage("/images/ball.png"));
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
	serverBalls = balls;
	while(theirBalls[0] !== undefined)
	{
    theirBalls[0].remove();
	}
	for(var i=0; i<serverBalls.length; i++)
	{
		addball(serverBalls[i].x,serverBalls[i].y,serverBalls[i].velocityX,serverBalls[i].velocityY);
	}
}

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
				lastDrop = [camera.mouseX/camera.zoom,camera.mouseY/camera.zoom];
			}
		}
	}
}

function dropBall()
{
	var ball = createSprite((camera.mouseX/camera.zoom),(camera.mouseY/camera.zoom),50,50);
	ball.addImage(loadImage("/images/ball.png"));
	ball.scale = .1;
	ball.mass = ball.scale;
	ball.restitution = .74;
	ball.setCollider('circle', 0, 0, 120);
	//ball.debug = true;
	yourBalls.add(ball);
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
