/*	RapidCoffee is a free, opensource dynamic internet forum.
	(C) Copyright 2011.

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var CONF = new Array();
CONF['width-small-create-topic'] = 280;
CONF['height-small-create-topic'] = 250;
CONF['channel_desc_length'] = 200;
CONF['number_channels_signed_in_main'] = 25;
CONF['number_channels_suggest_in_main_reg'] = 2;
CONF['number_channels_suggest_in_main_anon'] = 5;
CONF['width_topic_expand'] = 820;
CONF['height_topic_expand'] = 400;
CONF['number_recent_topics'] = 10;
CONF['width_post'] = 840;
CONF['height_post'] = 250;

var ACCENTS = "çãâäàáêëèéïîìíûùüúöòóôÿñ";

CONF['nickname_chars'] = 'a-z0-9 \-+!#$%&*()=_{}\\]\\[\\|"/?<>,.\\\\:;'+ACCENTS;

function escape_ampersand(text)
{
	return text.replace(/&/g,'[a_mp]');
}

function escape_html(text)
{
	var e = jQuery('<div></div>');
	var newtext = e.text(text).html();
	e.remove();
	return newtext;
}

function check_numeric(c)
{
	return (!(c>=48 && c<=57))?0:c;
}

function check_alpha(c)
{
	return (!(c>=97&&c<=122|| c>=65 && c<=90))?0:c;
}

function check_alphanumeric(c)
{
	return (!(check_numeric(c) || check_alpha(c)))?0:c;
}

function check_chars(c, str)
{
	for (var i = 0; i < str.length; i++)
		if (c==str.charCodeAt(i))
			return true;
	return false;
}

function check_keycode_doesnt_produce_char(c)
{
	switch(c)
	{
		case 8:
		case 16:
		case 17:
		case 18:
		case 19:
		case 20:
		case 27:
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 38:
		case 39:
		case 40:
		case 45:
		case 46:
		case 91:
		case 92:
		case 93:
		case 144:
		case 145:
			return true;
		default:
			if (112 <= c && c >= 123)
				return true;
	}
	return false;
}

function check_keycode_enter(c)
{
	if (c==13)
		return true;
	return false;
}

function beautify_error(error)
{
	var flood = /^flood \d+$/;
	if (flood.test(error))
		return Engine.lang.msg_flood1+' '+error.match(/^flood (\d+)$/)[1]+' '+Engine.lang.msg_flood2;
	switch (error)
	{
		case 'asked for permission':
			return Engine.lang.msg_askedforpermission;
		case 'no email':
			return Engine.lang.msg_noemail;
		case 'invalid password':
			return Engine.lang.msg_invalidpassword;
			break
		case 'you cant create post in this channel':
			return Engine.lang.msg_cantpostchannel;
		case 'error anonymous cannot like':
			return Engine.lang.msg_anoncannotlike;
		case 'error anonymous cannot dislike':
			return Engine.lang.msg_anoncannotdislike;
		case 'you cant create topic in this channel':
			return Engine.lang.msg_canttopicchannel;
		case 'too short message':
			return Engine.lang.msg_tooshortmessage;
		case 'too short subject':
			return Engine.lang.msg_tooshortsubject;
		case 'user already exists':
			return Engine.lang.msg_useralreadyexists;
		case 'must validate email first':
			return Engine.lang.msg_mustvalidateemailfirst;
		case 'invalid nickname':
			return Engine.lang.msg_invalidnickname;
		case 'error null email':
			return Engine.lang.msg_nullemail;
		case 'no password':
			return Engine.lang.msg_nopassword;
		case 'channel owner cant unfollow':
			return Engine.lang.msg_channelownercantunfollow;
		case 'too short name':
			return Engine.lang.msg_tooshortname;
		default:
			return error;
	}
}


function password_strength(password)
{
        var score   = -1;

        if (password.length > 6) score++;
        if (password.length > 8) score++;
        if (password.length > 10) score++;
        if (password.length > 12) score++;
        if (password.length > 14) score++;
        if ( password.match(/[a-z]/) ) score++;
        if ( password.match(/[A-Z]/) ) score++;
        if ( password.match(/\d+/) ) score++;
        if ( password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/) ) score++;

	return score;
}

function password_strength_desc(score)
{
        var desc = new Array(6);
        desc[0] = Engine.lang.msg_pwdstrength0;
        desc[1] = Engine.lang.msg_pwdstrength1;
        desc[2] = Engine.lang.msg_pwdstrength2;
        desc[3] = Engine.lang.msg_pwdstrength3;
        desc[4] = Engine.lang.msg_pwdstrength4;
        desc[5] = Engine.lang.msg_pwdstrength5;
	return desc[Math.min(5,score)];
}

function timestamp()
{
	return Math.round(new Date().getTime() / 1000);
}
function checkEmailValidity(email)
{
	var at="@";
	var dot=".";
	var lat=email.indexOf(at);
	var lstr=email.length;
	var ldot=email.indexOf(dot);
	if (email.indexOf(at)==-1){
	   return false;
	}

	if (email.indexOf(at)==-1 || email.indexOf(at)==0 || email.indexOf(at)==lstr){
	   return false;
	}

	if (email.indexOf(dot)==-1 || email.indexOf(dot)==0 || email.indexOf(dot)==lstr){
	    return false;
	}

	 if (email.indexOf(at,(lat+1))!=-1){
	    return false;
	 }

	 if (email.substring(lat-1,lat)==dot || email.substring(lat+1,lat+2)==dot){
	    return false;
	 }

	 if (email.indexOf(dot,(lat+2))==-1){
	    return false;
	 }
	
	 if (email.indexOf(" ")!=-1){
	    return false;
	 }

 	 return true;
}

function addcss(path, data, callback)
{
	if (document.createStyleSheet)
	{
		document.createStyleSheet(path);
		callback(data);
	} else {
		var link = jQuery("<link rel='stylesheet' type='text/css' href='"+path+"' />");
		jQuery('head').append(link);
		var closure = (function(data, callback)
		{
			return function()
			{
				callback(data);
			};
		})(data, callback);
		link.ready(closure);
	}
}
function activate_input_placeholder(input)
{
	input = jQuery(input);
	var holder = input.parent().find('span.holder');
	holder.click({input:input}, function(event)
	{
		event.data.input.focus();
	});
	input.focus(function()
	{
		jQuery(this).parent().find('span.holder').hide();
	});
	input.blur(function()
	{
		var t = jQuery(this);
		if (t.val().length==0)
			t.parent().find('span.holder').show();
	});
}

function clearNickname(input){
	var name = input;
	var match = new RegExp('[^' + CONF['nickname_chars'] + ']','ig');

	name = name.replace(match, '');
	name = name.replace(/  +/g,' ');
	return (jQuery.trim(name));
}

function valid_url(str)
{
	return /^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(str);
}

function add_anchor_tag(str)
{
	var strs = str.split(' ');
	for (var i = 0; i < strs.length; i++)
	{
		if (valid_url(strs[i]))
		{
			strs[i] = '<a href="' + strs[i] + '" target="_blank">' + strs[i] + '</a>';
		}
	}
	return strs.join(' ');
}

function rcanchor(a)
{
	var url = a.prop('href');
	if (!/^(http:\/\/)?(www\.)?rapidcoffee\.com.*$/i.test(url))
		return;
	var f = url.match(/^(http:\/\/)?(www\.)?rapidcoffee\.com(.*)$/i)[3];
	var hash;
	if (f==='/#' || f==='/' || f==='')
		hash = '';
	else
	{
		hash = f.match(/\/#\/(.*)$/);
		if (!hash)
			return;
		hash = hash[1];
	}
	
	a.unbind().click({hash:hash}, function(event)
	{
		jQuery.address.value(event.data.hash);
		return false;
	});
}
