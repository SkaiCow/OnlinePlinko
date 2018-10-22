var listOfBalls = [];
//epected ball object {player : id, x : ballX, y : ballY, velocityX : ballVX, velocityY : ballVY, color:[r,g,b]}

module.exports = class GameManager
{
	static updateMyBalls(id,msg,color)
	{
		if(listOfBalls.length > 0)
			for(var i=listOfBalls.length-1; i>=0; i--)
				if(listOfBalls[i].player == id)
					listOfBalls.splice(i,1);
		msg.forEach(function(ball){
			ball.player = id;
			ball.color = color;
			listOfBalls.push(ball);
		});
		//console.log(listOfBalls[0].player+" updated their balls, the list is now " + listOfBalls.length);
	}

	static updateAllBalls()
	{
		var clients = SystemManager.getAllUsers();
		if(clients.length > 1 && listOfBalls.length > 0)
		{
			clients.forEach(function(user){
				var list = [];
				listOfBalls.forEach(function(ball){
					if(ball.player != user.id)
					{
						list.push(ball);
					}
				});
				user.emit('game',{type:'physics', values:list});
			});
		}
	}

	static sendColor(client)
	{
		client.emit('game',{type:'color', color:client.color});
	}
}
