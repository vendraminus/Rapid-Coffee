var Animation = Class.extend({

	init:function()
	{
		this.types = new Array();
		this.objs = new Array();
	},
	push:function(type, obj)
	{
		this.types.push(type);
		this.objs.push(obj);
	},
	_loop:function()
	{
		if (this.objs.length<=0)
			return;

		var handler = (function(thi)
		{
			return function()
			{
				thi._loop();
			}
		})(this);

		var type = this.types.pop();
		var obj = this.objs.pop();
		if (type=='slideDown')
			obj.slideDown(2000,handler);
		else if (type()=='slideUp')
			obj.slideUp(2000,handler);
	},
	start:function()
	{
		this._loop();	
	}
});
