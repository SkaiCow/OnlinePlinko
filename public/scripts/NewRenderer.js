var lastWindowHeight;
var lastMouseClick;

var canvasElement;

var listOfBalls = [];
var listOfScore = [];
var listOfParticalSystems = [];

//imgaes
var ballImage;
var point100Image;
var point200Image;
var point300Image;
var point500Image;
var point0Image;

function preload()
{
	ballImage = loadImage("/images/ball.png");
	point100Image = loadImage("/images/points-100.png");
	point200Image = loadImage("/images/points-200.png");
	point300Image = loadImage("/images/points-300.png");
	point500Image = loadImage("/images/points-500.png");
	point0Image = loadImage("/images/points-0.png");
}

function setup()
{
	canvasElement = createCanvas(1300,800);
	canvasElement.class("GameCanvasWide");
	lastWindowHeight = windowHeight;
	lastMouseClick = createVector(0,0);
	setCamera(0,0,1);
	rectMode(CENTER);
	angleMode(DEGREES);
	imageMode(CENTER);
}

function draw()
{
	background(75, 75, 75);
	listOfBalls.forEach(function(body, i){
		switch (body.type) {
			case 'Circle Body':
				var circle = new Circlely(body.x,body.y,body.radius,body.rotation);
				circle.show();
			break;
			case 'Rectangle Body':
				var box = new Boxer(body.x,body.y,body.width,body.height,body.rotation);
				box.show();
			break;
			case 'ball':
				var ball = new Ball(body.x,body.y,body.radius,body.rotation,body.color);
				ball.show();
			break;
		}
	});
	listOfParticalSystems.forEach(function(system,i){
		if(system.done() == true)
		{
			listOfParticalSystems.splice(i, 1);
		}
		else
		{
			system.run();
		}

	});
	var horSpacing = 30.4;
	listOfScore.forEach(function(score,i){
		switch(score)
		{
			case '0':
				var score = new ScoreBox(-333+(horSpacing*i),317,25,48,point0Image);
				score.show();
			break;
			case '100':
				var score = new ScoreBox(-333+(horSpacing*i),317,25,48,point100Image);
				score.show();
			break;
			case '200':
				var score = new ScoreBox(-333+(horSpacing*i),317,25,48,point200Image);
				score.show();
			break;
			case '300':
				var score = new ScoreBox(-333+(horSpacing*i),317,25,48,point300Image);
				score.show();
			break;
			case '500':
				var score = new ScoreBox(-333+(horSpacing*i),317,25,48,point500Image);
				score.show();
			break;
		}
	});
	//those extra 0 point pockets that dont changed
	push();
	translate(-363.4,317);
	image(point0Image,0,0,25,48);
	translate(729.6,0);
	image(point0Image,0,0,25,48);
	pop();
}

function loadOtherBalls(balls)
{
	listOfBalls = balls;
}

function updateScoreList(list)
{
	listOfScore = list;
}

function mouseClicked()
{
	if(camera.mouseX/camera.zoom > -380 && camera.mouseX/camera.zoom < 380 && camera.mouseY/camera.zoom < -270 && camera.mouseY/camera.zoom > -350)
	{
		if(lastMouseClick.equals(camera.mouseX/camera.zoom,camera.mouseY/camera.zoom))
		{
			listOfParticalSystems.push(new ParticalSystem('stop',createVector(camera.mouseX/camera.zoom,camera.mouseY/camera.zoom)));
		}
		else
		{
			io.emit('game',{type:'click',values:{x:camera.mouseX/camera.zoom,y:camera.mouseY/camera.zoom}});
		}
		lastMouseClick = createVector(camera.mouseX/camera.zoom,camera.mouseY/camera.zoom);
	}
	else
	{
		//listOfParticalSystems.push(new ParticalSystem('stop',createVector(camera.mouseX/camera.zoom,camera.mouseY/camera.zoom)));
		listOfParticalSystems.push(new ParticalSystem('star',createVector(camera.mouseX/camera.zoom,camera.mouseY/camera.zoom),{color:color(180,180,0),lifeTime:50}));
	}
}

function setCamera(x,y,zoom)
{
	camera.position.x = x+.001;
	camera.position.y = y+.001;
	camera.scale = zoom;
}

function windowResized()
{
	if(windowWidth/windowHeight > canvasElement.width/canvasElement.height)
	{
		canvasElement.class("GameCanvasWide");
	}
	else
	{
		canvasElement.class("GameCanvasTall");
	}
}
