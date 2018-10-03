var lastWindowHeight;

var balls;
var theirBalls;
var pegs;
var pockets;
var dropStart;
var dropEnd;

var lastDrop = [];

function preload()
{

}

function setup()
{
	createCanvas(windowWidth, windowHeight);
	lastWindowHeight = windowHeight;

	balls = new Group();
	pegs = new Group();
	pockets = new Group();

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

	for(var i=0; i<balls.length; i++)
	{
		balls.get(i).addSpeed(.1,90);
	}
	balls.bounce(pegs);
	balls.bounce(balls);
	balls.bounce(pockets);
	balls.overlap(dropEnd,function(){this.remove()});
	drawSprites();
}

function loadOtherBalls(otherBalls)
{
	for(var i=0; i<otherBalls; i=i+4)
	{
		var ball = createSprite(otherBalls[i],otherBalls[i+1],50,50);
		ball.addImage(loadImage("/images/ball.png"));
		ball.scale = .1;
		ball.mass = ball.scale;
		ball.restitution = .74;
		ball.setCollider('circle', 0, 0, 120);
		ball.setVelocity(otherBalls[i+2],otherBalls[i+3]);
		//ball.debug = true;
		theirBalls.add(ball);
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
	console.log("fuck");
	var ball = createSprite((camera.mouseX/camera.zoom),(camera.mouseY/camera.zoom),50,50);
	ball.addImage(loadImage("/images/ball.png"));
	ball.scale = .1;
	ball.mass = ball.scale;
	ball.restitution = .74;
	ball.setCollider('circle', 0, 0, 120);
	//ball.debug = true;
	balls.add(ball);
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
