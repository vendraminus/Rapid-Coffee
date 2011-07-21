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
var LANGU = Class.extend({
	
	init: function(json) {

		if (json==null)
			return;

		this.update(json);
	},
	update: function(json)
	{
		for (var tmp in json)
		{
			this[tmp]=json[tmp];
		}
	}
});

var User = Class.extend({
	
	init: function(json) {

		this.usedtimestamp = timestamp();

		//LUCAS: botar isso no bd/php
		this.expertises = new Array("/programação/C++","/história/história do brasil");
		this.level = "Novato 4";
		this.reputation = 130;
		this.nposts = 40;
		this.ntopics = 4;
		this.homepage = "http://www.uol.com.br";
		this.msn = "pimpao@hotmail.com";
		this.gtalk = "pimpao@gtalk.com";
		this.facebook = "http://www.facebook.com/profile";
		this.orkut = "http://www.orkut.com/profile";
		this.yearsold = 25;
		this.sex = "Homem";
		this.regdate = "10/03/2010";

		if (json==null)
			return;
		this.update(json);
	},
	getNumberExpertises:function() { return this.expertises.length; },
	update: function(json)
	{
		this.usedtimestamp = timestamp();
		if (json.id!=null)
			this.id = json.id;
		if (json.email!=null)
			this.email = json.email;
		if (json.nickname!=null)
			this.nickname = json.nickname;
		if (json.credits!=null)
			this.credits = json.credits;
		if (json.hasavatar!=null)
			this.hasavatar = json.hasavatar;
		if (json.avatar_update_time!=null)
			this.avatar_update_time = json.avatar_update_time;
		if (json.signature!=null)
			this.signature = json.signature;
		if (json.lang!=null)
			this.lang = json.lang;
		if (json.anon!=null)
			this.anon = json.anon;
		if (json.camefrom_name)
			this.camefrom = json.camefrom_name;
		if (json.timeago)
			this.timeago = json.timeago;
		if (json.firsttime)
			this.firsttime = json.firsttime;
		if (json.email_mytopics)
			this.email_mytopics = json.email_mytopics;
		if (json.email_mychannels)
			this.email_mychannels = json.email_mychannels;
		if (json.email_followedtopics)
			this.email_followedtopics = json.email_followedtopics;
		if (json.email_followedchannels)
			this.email_followedchannels = json.email_followedchannels;

	},
	get:function(property)
	{
		this.usedtimestamp = timestamp();
		// LUCAS:remover isso aqui qd vc implementar o User
		// nas classes Topic e Post
		if (property==='id' && !this.id)
			return 128;
		return this[property];
	},
	onlineUpdate:function()
	{
	},
	avatar: function(size)
	{
		this.usedtimestamp = timestamp();

		if (this.hasavatar)
			return 'imgs/avatar/'+this.nickname.toLowerCase()+'-'+size+'-'+this.avatar_update_time+'.png';
		return 'imgs/default-avatar-'+size+'.png';
	},
	amIAuthorThisChannel: function(channel)
	{
		this.usedtimestamp = timestamp();
		return this.nickname.toLowerCase()==channel.author.toLowerCase();
	},
	amISubscriberThisChannel: function(channel)
	{
		this.usedtimestamp = timestamp();
		return channel.isfollowing;
	}
});


var Channel = Class.extend({

	init: function(json) {

		this.usedtimestamp = timestamp();
		if (json==null)
			return

		this.update(json);
	},
	update: function(json)
	{
		this.usedtimestamp = timestamp();
		if (json.id!=null)
			this.id = json.id;
		if (json.name!=null)
			this.name = json.name;
		if (json.urlname!=null)
			this.urlname = json.urlname;
		if (json.subsumeddescription!=null)
			this.description = json.subsumeddescription;
		if (json.date!=null)
			this.date = json.date;
		if (json.author!=null)
			this.author = json.author;
		if (json.asktofollow!=null)
			this.asktofollow = json.asktofollow;
		if (json.perm_member!=null)
			this.perm_member = json.perm_member;
		if (json.perm_reguser!=null)
			this.perm_reguser = json.perm_reguser;
		if (json.perm_anon!=null)
			this.perm_anon = json.perm_anon;
		if (json.haslogo!=null)
			this.haslogo = json.haslogo;
		if (json.logo_update_time!=null)
			this.logo_update_time = json.logo_update_time;
		if (json.isfollowing!=null)
			this.isfollowing = json.isfollowing;
		if (json.lang!=null)
			this.lang = json.lang;
	},
	get: function(property)
	{
		this.usedtimestamp = timestamp();
		return this[property];
	},
	onlineUpdate:function()
	{
		this.usedtimestamp = timestamp();
	},
	logo: function(size)
	{
		this.usedtimestamp = timestamp();
		if (this.haslogo)
			return 'imgs/channel_logo/'+this.id+'-'+size+'-'+this.logo_update_time+'.png';
		return 'imgs/default-clogo-'+size+'.png';
	},
	save: function(data, suc)
	{
		this.usedtimestamp = timestamp();
		return Mailman.updateChannel(this.id, this.description, this.lang, this.asktofollow,this.perm_member,this.perm_reguser,this.perm_anon, data, suc);
	},
	subscribe: function(data, suc)
	{
		this.usedtimestamp = timestamp();
		Mailman.subscribeChannel(this.id, {thi:this, data:data, suc:suc}, function(r, data)
		{
			if (r.ok)
				data.thi.isfollowing = true;
			else
				new SimpleNotice(beautify_error(r.error));

			data.suc(r.ok, data.data);
		});
	},
	unsubscribe: function(data, suc)
	{
		this.usedtimestamp = timestamp();
		Mailman.unsubscribeChannel(this.id, {thi:this, data:data, suc:suc}, function(r, data)
		{
			if (r.ok)
				data.thi.isfollowing = false;
			else
				new SimpleNotice(beautify_error(r.error));

			data.suc(r.ok, data.data);
		});
	},
	canICreateTopic: function()
	{
		this.usedtimestamp = timestamp();
		return this._canI(3);
	},
	canIPost: function()
	{
		this.usedtimestamp = timestamp();
		return this._canI(2);
	},
	_canI:function(level)
	{
		var user = Engine.getMyUserSession();
		if (user.amIAuthorThisChannel(this))
			return true;
		if (user.amISubscriberThisChannel(this))
			if (this.perm_member>=level)
				return true;
			else
				return false;
		if (user.get('anon'))
			if (this.perm_anon>=level)
				return true;
			else
				return false;
		if (this.perm_member>=level)
			return true;
		return false;
	}
});


var Topic = Class.extend({

	init: function(json)
	{
		this.visitedversion = -1;
		this.usedtimestamp = timestamp();
		this.posts = new Array();

		if (json)
			this.update(json);
	},
	update: function(json)
	{
		this.usedtimestamp = timestamp();
		if (json.id!=null)
			this.id = json.id;
		if (json.subject!=null)
			this.subject = json.subject;
		if (json.msg!=null)
			this.msg = json.msg;
		if (json.author!=null)
			this.author = json.author;
		if (json.signature!=null)
			this.signature = json.signature;
		if (json.author_hasavatar!=null)
			this.author_hasavatar = json.author_hasavatar;
		if (json.author_avatar_update_time!=null)
			this.author_avatar_update_time = json.author_avatar_update_time;
		if (json.channel_haslogo!=null)
			this.channel_haslogo = json.channel_haslogo;
		if (json.channel_logo_update_time!=null)
			this.channel_logo_update_time = json.channel_logo_update_time;
		if (json.channel!=null)
			this.channel = json.channel;
		if (json.channelid!=null)
			this.channelid = json.channelid;
		if (json.replies!=null)
			this.replies = json.replies;
		if (json.views!=null)
			this.views = json.views;
		if (json.likes!=null)
			this.likes = json.likes;
		if (json.dislikes!=null)
			this.dislikes = json.dislikes;
		if (json.timeago!=null)
			this.timeago = json.timeago;
		if (json.updatetimeago!=null)
			this.updatetimeago = json.updatetimeago;
		if (json.version!=null)
			this.version = json.version;
		if (json.subsumedmsg!=null)
			this.subsumedmsg = json.subsumedmsg;
		if (json.lang!=null)
			this.lang = json.lang;
		if (json.ldvote!=null)
			this.ldvote = json.ldvote;
		if (json.isfollowing!=null)
			this.isfollowing = json.isfollowing;
		if (json.upped!=null)
			this.upped = json.upped;
		if (json.orderid!=null)
			this.orderid = json.orderid;
		if (json.subject_for_url!=null)
			this.subject_for_url = json.subject_for_url;

		if (json.posts)
		{
			this.posts = Array(json.posts.length);
			for (var i = 0; i < json.posts.length; i++)
			{
				this.posts[i]=Repository.createPost(json.posts[i]);
			}
		}
	},
	get:function(property)
	{
		this.usedtimestamp = timestamp();
		//LUCAS: acho melhor retornar o usuario que criou o topic
		//pq começarei a usar monte de informacao dele
		//alem disso, fica mais facil...
		if (property==='user')
			return new User();
		return this[property];
	},
	onlineUpdate:function()
	{
		this.usedtimestamp = timestamp();
	},
	avatar: function(size)
	{
		this.usedtimestamp = timestamp();
		if (this.author_hasavatar)
			return 'imgs/avatar/'+this.author.toLowerCase()+'-'+size+'-'+this.author_avatar_update_time+'.png';
		return 'imgs/default-avatar-'+size+'.png';
	},
	logo: function(size)
	{
		this.usedtimestamp = timestamp();
		if (this.channel_haslogo){
			return 'imgs/channel_logo/'+this.channelid+'-'+size+'-'+this.channel_logo_update_time+'.png';}
		return 'imgs/default-clogo-'+size+'.png';
	},
	like: function(input, suc, err)
	{
		this.usedtimestamp = timestamp();
		Mailman.likedislikeTopic(this.id, 'yes', {tid:this.id,input:input,suc:suc,err:err}, function(r, data)
		{
			if (r.ok)
			{
				Mailman.getTopic(data.tid, {input:data.input,suc:data.suc}, function(r, data)
				{
					data.suc(r, data.input);
				});
			} else
				data.err(r, data.input);
		});
	},
	dislike: function(input, suc, err)
	{
		this.usedtimestamp = timestamp();
		Mailman.likedislikeTopic(this.id, 'no', {tid:this.id,input:input,suc:suc,err:err}, function(r, data)
		{
			if (r.ok)
			{
				Mailman.getTopic(data.tid, {input:data.input,suc:data.suc}, function(r, data)
				{
					data.suc(r, data.input);
				});
			} else
				data.err(r, data.input);
		});
	},
	followTopic:function()
	{
		this.usedtimestamp = timestamp();
		var response = Mailman.followTopic(this.id);
		if (response.ok) {
			new FastNotice(Engine.lang.msg_followingtopic);
			this.isfollowing=true;
		} else
			new SimpleNotice(beautify_error(response.error));
	},
	unfollowTopic:function()
	{
		this.usedtimestamp = timestamp();
		var response = Mailman.unfollowTopic(this.id);
		if (response.ok){
			new FastNotice(Engine.lang.msg_unfollowingtopic);
			this.isfollowing=false;
		} else
			new SimpleNotice(beautify_error(response.error));
	},
	visit:function()
	{
		if (this.visitedversion==-1 || this.visitedversion!=this.version){
			Mailman.visitTopic(this.id);
		}
		this.visitedversion = this.version;
	},
	sawThisVersion:function()
	{
		return this.visitedversion == this.version;
	}
});


var Post = Class.extend({

	init:function(json)
	{
		this.usedtimestamp = timestamp();
		if (json==null)
			return

		this.update(json);
	},
	update:function(json)
	{
		this.iversion++;
		this.usedtimestamp = timestamp();
		if (json.id!=null)
			this.id = json.id;
		if (json.topicid!=null)
			this.topicid = json.topicid;
		if (json.post!=null)
			this.post = json.post;
		if (json.author!=null)
			this.author = json.author;
		if (json.signature!=null)
			this.signature = json.signature;
		if (json.likes!=null)
			this.likes = json.likes;
		if (json.dislikes!=null)
			this.dislikes = json.dislikes;
		if (json.timeago!=null)
			this.timeago = json.timeago;
		if (json.updatetimeago!=null)
			this.updatetimeago = json.updatetimeago;
		if (json.ldvote!=null)
			this.ldvote = json.ldvote;
		if (json.author_hasavatar!=null)
			this.author_hasavatar = json.author_hasavatar;
		if (json.author_avatar_update_time!=null)
			this.author_avatar_update_time = json.author_avatar_update_time;
	},
	get:function(property)
	{
		this.usedtimestamp = timestamp();
		//LUCAS: acho melhor retornar o usuario que criou o post
		//pq começarei a usar monte de informacao dele
		//alem disso, fica mais facil...
		if (property==='user')
			return new User();
		return this[property];
	},
	avatar: function(size)
	{
		this.usedtimestamp = timestamp();
		if (this.author_hasavatar)
			return 'imgs/avatar/'+this.author.toLowerCase()+'-'+size+'-'+this.author_avatar_update_time+'.png';
		return 'imgs/default-avatar-'+size+'.png';
	},
	like: function(input, suc, err)
	{
		this.usedtimestamp = timestamp();
		Mailman.likedislikePost(this.id, 'yes', {tid:this.topicid,input:input,suc:suc,err:err}, function(r, data)
		{
			if (r.ok)
			{
				Mailman.getTopic(data.tid, {input:data.input,suc:data.suc}, function(r, data)
				{
					data.suc(r, data.input);
				});
			} else
				data.err(r, data.input);
		});
		this.usedtimestamp = timestamp();
	},
	dislike: function(input, suc, err)
	{
		this.usedtimestamp = timestamp();
		Mailman.likedislikePost(this.id, 'no', {tid:this.topicid,input:input,suc:suc,err:err}, function(r, data)
		{
			if (r.ok)
			{
				Mailman.getTopic(data.tid, {input:data.input,suc:data.suc}, function(r, data)
				{
					data.suc(r, data.input);
				});
			} else
				data.err(r, data.input);
		});
	}
});


var Repository = new function REPOSITORY()
{
	this.initialize = function()
	{
		//console.log('Repository.initialize');
		this.templates = new Object();
		this.topics = new Object();
		this.posts = new Object();
		this.users = new Object();
		this.channels = new Object();
		this.lang = new LANGU();
	};
	this.destroy = function()
	{
		this.templates = null;
		this.topics = null;
		this.posts = null;
		this.users = null;
		this.channels = null;
	};
	this.onlineUpdate = function()
	{
		var tp_ids='';
		var tp_versions='';
		var tf_ids='';
		var tf_versions='';
		for (var topic in this.topics) {
			if (this.topics[topic].FULL){
				tf_ids+=this.topics[topic].id+',';
				tf_versions+=this.topics[topic].version+',';
			} else {
				tp_ids+=this.topics[topic].id+',';
				tp_versions+=this.topics[topic].version+',';
			}
		}
		/*console.log(tp_ids);
		console.log(tp_versions);
		console.log(tf_ids);
		console.log(tf_versions);*/
		Mailman.getRefreshTopicPreviews(tp_ids,tp_versions);
		Mailman.getRefreshTopics(tf_ids,tf_versions);
		//Mailman.getMyUserSession();
		/*for (var user in this.users) {
			this.users[user].onlineUpdate();
		}
		for (var channel in this.channels) {
			this.channels[channel].onlineUpdate();
		}*/
	};
	this.getTemplate = function(name, func)
	{
		if (this.templates[name]==null)
			return null;

		return this.templates[name];
	};
	this.addTemplate = function(name, template)
	{
		this.templates[name] = template;
	};
	this.getTopic = function(id)
	{
		return this.topics[id];
	};
	this.getPost = function(id)
	{
		return this.posts[id];
	};
	this.getChannel = function(id)
	{
		return this.channels[id];
	};
	this.getLANG = function(){
		return this.lang;
	};
	this.getUser = function(id)
	{
		return this.users[id];
	};
	this.createTopic = function(json, full)
	{
		var topic = this.getTopic(json.id);
		if (topic==null)
			this.topics[json.id] = new Topic(json);
		else
			this.topics[json.id].update(json);
		if (full) this.topics[json.id].FULL=true;
		return this.topics[json.id];
	};
	this.createPost = function(json)
	{
		var post = this.getPost(json.id);
		if (post==null)
			this.posts[json.id] = new Post(json);
		else
			this.posts[json.id].update(json);
		return this.posts[json.id];
	};
	this.createChannel = function(json){
		var channel = this.getChannel(json.id);
		if (channel==null)
			this.channels[json.id] = new Channel(json);
		else
			this.channels[json.id].update(json);
		return this.channels[json.id];
	};
	this.createUser = function(json)
	{
		var user = this.getUser(json.id);
		if (user==null)
			this.users[json.id] = new User(json);
		else
			this.users[json.id].update(json);
		return this.users[json.id];
	};
	this.createLANG  = function(json)
	{
		var lang = this.getLANG();
		lang.update(json);
		return lang;
	}
};

