jQuery.fn.clickOrEnter = function(a1,a2)
{
	if (arguments.length==1)
	{
		var data = {callback:a1};
	} else {
		var data = a1;
		data.callback = a2;
	}

	jQuery(this).click(data, function(event)
	{
		return event.data.callback(event);
	});
	jQuery(this).keypress(data, function(event)
	{
		var code=event.charCode || event.keyCode;
		if(code && code == 13)
			return event.data.callback(event);
	});
};
jQuery.fn.enter = function(a1,a2)
{
	if (arguments.length==1)
	{
		var data = null;
		var callback = a1;
	} else {
		var data = a1;
		var callback = a2;
	}

	jQuery(this).keypress(data, function(event)
	{
		var code=event.charCode || event.keyCode;
		if(code && code == 13)
			return callback(event);
		return true;
	});
};
