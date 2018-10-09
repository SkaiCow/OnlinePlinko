var listOfBalls = [];
//epected ball object {player : client, x : ballX, y : ballY, velocityX : ballVX, velocityY : ballVY}

module.exports = class GameManager
{
	static updateMyBalls(client,msg)
	{
		listOfBalls.forEach(function(ball,index){
			if(ball.player === client)
				listOfBalls.splice(index,1);
		});
		msg.forEach(function(ball){
			listOfBalls.push(ball);
		});
		console.log("some updated the balls: "+listOfBalls);
	}
	static updateAllBalls()
	{
		io.emit('physics',listOfBalls);
	}
}
