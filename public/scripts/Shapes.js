function Boxer(x,y,w,h,r)
{
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.rotation = r;
}

Boxer.prototype.show = function()
{
	push();
	stroke('rgb(0,255,0)');
	strokeWeight(2);
	fill(51);
	translate(this.x,this.y);
	rotate(this.rotation);
	rect(0,0,this.width,this.height);
	pop();
}

function Circlely(x,y,r,ro)
{
	this.x = x;
	this.y = y;
	this.radius = r;
	this.rotation = ro;
}

Circlely.prototype.show = function()
{
	push();
	stroke('rgb(0,255,0)');
	strokeWeight(2);
	fill(51);
	translate(this.x,this.y);
	rotate(this.rotation);
	ellipse(0,0,this.radius*2);
	pop();
}

function Ball(x,y,r,ro,c)
{
	this.x = x;
	this.y = y;
	this.radius = r;
	this.rotation = ro;
	this.color = c;
}
Ball.prototype.show = function()
{
	push();
	stroke(this.color[0],this.color[1],this.color[2]);
	strokeWeight(2);
	fill(51);
	translate(this.x,this.y);
	ellipse(0,0,this.radius*2);
	image(ballImage,0,0,this.radius*2+2,this.radius*2+2);
	pop();
}

function ScoreBox(x,y,w,h,type)
{
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.type = type;
}
ScoreBox.prototype.show = function()
{
	push();
	translate(this.x,this.y);
	image(this.type,0,0,this.width,this.height);
	pop();
}
