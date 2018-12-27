var color = [50,0,0];

var clients = [];

module.exports = class SystemManager
{
	static addConnection(connection)
	{
		clients.push(connection);
	}

	static getAllUsers()
	{
		return clients;
	}

	static updateUser(client)
	{
		var obj = {BackColor : color};
		client.emit('system', obj);
	}

	static changeBackColor(values)
	{
		values = values.split(",");
		color = [values[0],values[1],values[2]];
		var obj = {BackColor : color};
		io.emit('system', obj);
		io.emit('message', "The Background Color has been changed.")
	}

	static getRandColor()
	{
		var colorvalt = 255;
		var R = Math.random() * colorvalt;
		//colorvalt = colorvalt - R;
		var G = Math.random() * colorvalt;
		//colorvalt = colorvalt - G;
		var B = Math.random() * colorvalt;
		return [R,G,B];
	}
}
