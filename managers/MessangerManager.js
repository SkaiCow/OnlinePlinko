var chatHistory = [];

module.exports = class MessangerManager
{
	static sendToAll(msg)
	{
		io.emit('message',msg);
	}
}
