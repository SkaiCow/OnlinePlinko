var clients = [];
var chatHistory = [];

module.exports = class MessangerManager
{
	static sendToAll(msg)
	{
		io.emit('message',msg);
		/*
		for(var i = 0; i < clients.length; i++)
		{
			clients[i].sendUTF(msg.data);
		}
		*/
	}

	static addConnection(connection)
	{
		clients.push(connection);
	}
}
