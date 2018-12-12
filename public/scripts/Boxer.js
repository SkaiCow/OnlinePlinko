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
