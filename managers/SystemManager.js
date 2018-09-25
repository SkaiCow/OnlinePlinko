var color = [50,0,0];

module.exports = class SystemManager
{
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
}
