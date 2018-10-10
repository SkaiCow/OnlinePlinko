var listOfBalls = [];
//epected ball object {player : client, x : ballX, y : ballY, velocityX : ballVX, velocityY : ballVY}

module.exports = class GameManager
{
	static updateMyBalls(id,msg)
	{
		if(listOfBalls.length > 0)
			for(var i=listOfBalls.length-1; i>=0; i--)
				if(listOfBalls[i].player == id)
					listOfBalls.splice(i,1);
		msg.forEach(function(ball){
			ball.player = id;
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
						console.log("this should only go off once for one ball");
					}
				});
				user.emit('physics',list);
			});
		}
	}
}
