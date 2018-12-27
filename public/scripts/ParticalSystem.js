//ok so im going to really have to think about this
//the system will be defined by type,x,y as those are must haves
//this the added info will be in an object called options just like matter.js
//i want this file to handle all tpyes of particals

function ParticalSystem(t,position,o)
{
	this.type = t;
	this.origin = position.copy();
	this.options = o || {};
	this.particals = [];
	this.frame = 0;
	switch(this.type)
	{
		case 'stop':this.particals.push(new stop_P(this.origin));
		break;
		case 'star':
			for(var i = 0; i<5; i++)
				this.particals.push(new star_P(this.origin,this.options));
		break;
	}
}

ParticalSystem.prototype.run = function()
{
	this.particals.forEach(function(partical,i){
		partical.update();
		partical.display();
	});
	this.frame += 1;
}

ParticalSystem.prototype.done = function()
{
	var done = false;
	this.particals.forEach(function(partical,i){
		if(partical.stop == true)
			done = true;
	});
	if(this.options.lifeTime != undefined)
	{
		if(this.frame >= this.options.lifeTime)
			done = true;
	}
	return done;
}

function stop_P(position)
{
	this.position = position.copy();
	this.radius = 0;
	this.opacity = 255;
	this.frame = 0;
	this.stop;
}

stop_P.prototype.update = function()
{
	var maxRad = 20;
	var peek = 10;
	var fade = 20;
	if(this.frame < 10)
	{
		this.radius = -.2*Math.pow(this.frame-10,2)+20;
	}
	else
	{
		this.radius = -1*this.frame+30;
		this.opacity -= 20;
	}
	if(this.frame >= 30)
		this.stop = true;
	this.frame += 1;
}

stop_P.prototype.display = function()
{
	push();
		translate(this.position.x,this.position.y);
		fill(255, 0, 0, this.opacity);
		strokeWeight(0);
		ellipse(0,0,this.radius*2,this.radius*2);
	pop();
}

function star_P(position,options)
{
	this.position = position.copy();
	this.options = options;
	this.velocity = createVector(random(-1,1),random(-8,-5));
	this.gravity = createVector(0,.3);
	this.frame = 0;
}

star_P.prototype.update = function()
{
	this.velocity = this.velocity.add(this.gravity);
	this.position = this.position.add(this.velocity);
	this.fram += 1;
}
star_P.prototype.display = function()
{
	push();
		translate(this.position.x,this.position.y);
		fill(this.options.color);
		strokeWeight(2);
		star(0,0,5,7,5);
	pop();
}

function star(x, y, radius1, radius2, npoints)
{
  var angle = (2*3.14) / 5;
  var halfAngle = angle/2.0;
	angleMode(RADIANS);
  beginShape();
  for(var i = 0; i<=npoints; i++)
	{
		var x = sin(angle*i)*radius2;
		var y = cos(angle*i)*radius2;
		curveVertex(x,y);
		x = sin(angle*(i+.5))*radius1;
		y = cos(angle*(i+.5))*radius1;
		curveVertex(x,y);
	}
  endShape(CLOSE);
	angleMode(DEGREES);
}
