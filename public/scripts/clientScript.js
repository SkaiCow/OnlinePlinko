var io = io();

io.on('connect', function(){
	console.log("hey i have connected to the server");
});

io.on('game', function(msg)
{
	switch(msg.type)
	{
		case 'objects': loadOtherBalls(msg.values);
			updateScoreList(msg.score);
		break;
	}

});
io.on('score', function(msg){
	switch(msg.type)
	{
		case 'scored':
		listOfParticalSystems.push(new ParticalSystem('star',createVector(-332+(30.2*msg.slot),320),{color:color(180,180,0),lifeTime:50}));
		break;
	}
});
/*
io.on('system', function(msg)
{
	console.log(msg);
	$("body").css({"background-color" : "rgb("+msg.BackColor[0]+","+msg.BackColor[1]+","+msg.BackColor[2]+")"});
});

io.on('message', function(msg)
{
	$(".chat-container").append(msg+"<br>");
});

$(document).on('change', '.chat-input', function() {
	if($(this).val().charAt(0) == "/")
	{
		io.emit('system',$(this).val());
	}
	else
	{
		io.emit('message',$(this).val());
	}

	$(this).val("");
});*/
