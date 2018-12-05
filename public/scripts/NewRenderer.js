var lastWindowHeight;

var listOfBalls = [];

function preload()
{

}

function setup()
{
	createCanvas(windowWidth, windowHeight);
	lastWindowHeight = windowHeight;
	setCamera(0,0,1);
	rectMode(CENTER);
	angleMode(DEGREES);
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
		}
	});
}

function loadOtherBalls(balls)
{
	listOfBalls = balls;
}

function mouseClicked()
{
	io.emit('game',{type:'click',values:{x:camera.mouseX/camera.zoom,y:camera.mouseY/camera.zoom}});
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
