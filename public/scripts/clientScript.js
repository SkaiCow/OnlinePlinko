var io = io();

io.on('connect', function(){
	console.log("hey i have connected to the server");
});

io.on('game', function(msg)
{
	switch(msg.type)
	{
		case 'balls': loadOtherBalls(msg.values);
		break;
		case 'objects': listOfObjects = msg.values;
		break;
		/*
		case 'color': myServerColor(msg);
		break;
		case 'score': updateScore(msg);
		break;*/
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
