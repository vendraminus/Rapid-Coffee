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
var HistoryTabClick = function(tab)
{
	jQuery.address.value(tab.getHash());
	return false;
};

var History = new function HISTORY()
{

	this.initialize=function()
	{
		jQuery.address.change(jQuery.proxy(this.goto, this));
	};
	this.goto=function(event)
	{
		var hash = event.value.substr(1);
		if (hash==='')
		{
			Engine.getThe().selectMain(true);
			return;
		}
		var t = hash.split('-');
		var what = t[0];
		if (what==='schannel')
		{
			if (hash==='schannel-')
				var opt1 = '';
			else
				var opt1 = hash.substr('schannel-'.length);
		} else {
			if (t.length>1)
				var opt1 = t[1];
			if (t.length>2)
				var opt2 = t[2];
		}
		if (what==='topic')
			Engine.getThe().appendTopicTab(opt1, hash);
		else if (what==='channel')
			Engine.getThe().appendChannelTab(opt1, hash);
		else if (what==='schannel')
			Engine.getThe().appendSearchChannelsListTab(opt1, hash);
		else if (what==='cchannel')
			Engine.getThe().appendCreateChannel(hash);
		else if (what==='cuser')
			Engine.getThe().appendCreateUserTab(hash);
		else if (what==='myaccount')
			Engine.getThe().appendMyAccountTab(hash);
		else if (what==='cadmin')
			Engine.getThe().appendChannelAdmin(opt1, hash);
		else if (what==='pup')
			Engine.getThe().appendPublicUserPage(opt1, hash);
	};
	this.selectMain=function()
	{
		jQuery.address.value('');
	};
	this.appendTopicTab=function(id)
	{
		jQuery.address.value('topic-'+id);
	};
	this.appendChannelTab=function(id)
	{
		jQuery.address.value('channel-'+id);
	};
	this.appendSearchChannelsListTab=function(words)
	{
		jQuery.address.value('schannel-'+words);
	};
	this.appendCreateChannel=function()
	{
		jQuery.address.value('cchannel');
	};
	this.appendCreateUserTab=function()
	{
		jQuery.address.value('cuser');
	};
	this.appendMyAccountTab=function()
	{
		jQuery.address.value('myaccount');
	};
	this.appendChannelAdmin=function(channelid)
	{
		jQuery.address.value('cadmin-'+channelid);
	};
	this.appendPublicUserPage=function(userid)
	{
		jQuery.address.value('pup-'+userid);
	};
};

var Engine = new function ENGINE()
{
/*
	this.goto=function(hash)
	{
		if (hash==='')
		{
			Engine.getThe().selectMain(true);
			return;
		}
		var t = hash.split('-');
		var what = t[0];
		if (what==='schannel')
		{
			if (hash==='schannel-')
				var opt1 = '';
			else
				var opt1 = hash.substr('schannel-'.length);
		} else {
			if (t.length>1)
				var opt1 = t[1];
			if (t.length>2)
				var opt2 = t[2];
		}
		if (what==='topic')
			Engine.getThe().appendTopicTab(opt1, hash);
		else if (what==='channel')
			Engine.getThe().appendChannelTab(opt1, hash);
		else if (what==='schannel')
			Engine.getThe().appendSearchChannelsListTab(opt1, hash);
		else if (what==='cchannel')
			Engine.getThe().appendCreateChannel(hash);
		else if (what==='cuser')
			Engine.getThe().appendCreateUserTab(hash);
		else if (what==='myaccount')
			Engine.getThe().appendMyAccountTab(hash);
		else if (what==='cadmin')
			Engine.getThe().appendChannelAdmin(opt1, hash);
	};
*/
	this.initialize = function()
	{
		var visitnumber = jQuery.cookie('visitnumber');
		if (visitnumber)
			visitnumber = (parseInt(visitnumber)+1)+'';
		else
			visitnumber = '1';
		jQuery.cookie('visitnumber', visitnumber, {expires:365*10});

		this.tour = null;
		Mailman.initialize();
		Repository.initialize();
		this.updateLang();
		this.user = Mailman.getMyUserSession();
		this.the = new The();
		this.autoopenchannel();
		this.autoopentopic();
		if (visitnumber == '1')
			this.showWelcomePage();
		History.initialize();

		this.addthisInterval = setInterval(function()
		{
			try {
				addthis.init();
			} catch(e) {
				console.log('addthis could not be loaded yet.');
				return;
			}
			clearInterval(Engine.addthisInterval);
		}, 1000);
	};
	this.isTourRunning = function()
	{
		return this.tour !== null;
	};
	this.startTour = function()
	{
		this.tour = new Tour();
	};
	this.stopTour = function()
	{
		this.tour.destroy();
		this.tour = null;
		this.update();
	};
	this.updateLang = function(){
		this.lang = Mailman.getLANG();
	};
	this.autoopenchannel = function(){
		var ids1 = jQuery.cookie('autoopenchannel');
		if (ids1){
			var ids = ids1.split('_');
			for (var i=0;i<ids.length;i++)
				History.appendChannelTab(ids[i]);
			jQuery.cookie('autoopenchannel',null);
		}
	};
	this.autoopentopic = function(){
		var ids1 = jQuery.cookie('autoopentopic');
		if (ids1){
			var ids = ids1.split('_');
			for (var i=0;i<ids.length;i++)
				History.appendTopicTab(ids[i]);
			jQuery.cookie('autoopentopic',null);
		}
	};
	this.getThe = function()
	{
		return this.the;
	};
	this.showOfferChannels = function()
	{
		this.the.showOfferChannels();
	};
	this.destroyOfferChannels = function()
	{
		this.the.destroyOfferChannels();
	};
	this.showWelcomePage = function()
	{
		this.the.showWelcomePage();
	};
	this.destroyWelcomePage = function()
	{
		this.the.destroyWelcomePage();
	};
	this.updateUserSession = function(changedUser)
	{

		if (changedUser==null)
			changedUser = false;
		if (changedUser)
		{
			this.the.destroy();
			Repository.destroy();
			Mailman.destroy();
	
			Mailman.initialize();
			Repository.initialize();
		}
		this.user = Mailman.getMyUserSession();
		if (changedUser)
			this.the = new The();
	};
	this.getMyUserSession = function()
	{
		return this.user;
	};
	this.onlineUpdate = function()
	{
		Repository.onlineUpdate();
		if (this.the!=null)
			this.the.onlineUpdate();
	};
	this.rebuildMain = function()
	{
		this.the.rebuildMain();
	};
	this.update = function()
	{
		if (this.the!=null)
			this.the.update();
	};
	this.updateLikes = function()
	{
		if (this.the!=null)
			this.the.updateLikes();
	};
	this.onlineUpdateThenUpdate = function()
	{
		this.onlineUpdate();
		setTimeout("Engine.update();",2000);
	};
//	this.removeUFT = function(topicid){
//		this.the.removeUFT(topicid);
//	}
	this.addSignedChannel = function(channel){
		this.the.addSignedChannel(channel);
	};
	this.removeSignedChannel = function(channel){
		this.the.removeSignedChannel(channel);
	};
	this.signin = function()
	{
		this.the.signin();
	};
};

var Welcome = Class.extend({

	init: function()
	{
		this.users = new Array();
		this.view = new WelcomePage(this);
		this.view.show();
		var closure = (function(thi)
		{
			return function()
			{
				thi.updateRecentUsers(true);
			};
		})(this);

		this.updateRecentUsers(false);
		this.interval = setInterval(closure,5000);
	},
	destroy: function()
	{
		this.destroyed = true;
		clearInterval(this.invertal);
		this.view.destroy();
	},
	signin: function()
	{
		var nickemail = this.view.getSigninNickEmail();
		var password = this.view.getSigninPassword();
		var staylogged = this.view.getStaySignedin();

		if (nickemail.length==0)
		{
			this.view.emptySigninNickEmail();
			return;
		}
		if (password.length==0)
		{
			this.view.emptySigninPassword();
			return;
		}

		this.view.setSigninLoading();
		Mailman.trySignin(nickemail, password, staylogged, {thi:this}, function(r, data)
		{
			data.thi.view.unsetSigninLoading();
			if (r.ok)
			{
				Engine.destroyWelcomePage();
				Engine.signin();
				Engine.update();
			} else
				new SimpleNotice('Alerta', beautify_error(r.error));
		});
	},
	updateRecentUsers: function(animate)
	{
		Mailman.getRecentUsers(10, {thi:this,animate:animate}, function(recentusers, data)
		{
			if (data.thi.destroyed)
				return;
			for (var i = recentusers.length-1; i >= 0; i--)
				data.thi.addUser(recentusers[i], animate);
		});
	},
	addUser: function(user, animate)
	{
		if (this.users.length > 0)
			if (parseInt(user.get('id')) <= parseInt(this.users[this.users.length-1].get('id')))
				return;
		this.prependUser(user, animate);
	},
	prependUser: function(user, animate)
	{
		if (this.users.length>=10)
			this.users.shift();

		this.users.push(user);
		this.view.prependUser(user, animate);
	},
	submit: function()
	{

		var nick = this.view.getNickname();
		var email = this.view.getEmail();
		var pass = this.view.getPassword();
 
		this.view.eraseMessages();

		if (nick.length==0)
		{
			this.view.emptyNickname();
			return;
		}
		if (!this.checkAvailableNickname()){
			this.view.nicknameAlreadyInUse();
			return;
		}
		if (email.length==0)
		{
			this.view.emptyEmail();
			return;
		} 
		if (!checkEmailValidity(email))
		{
			this.view.invalidEmail();
			return;
		}
		if (!this.checkAvailableEmail()){
			this.view.emailAlreadyInUse();
			return;
		}
		if (pass.length==0)
		{
			this.view.emptyPassword();
			return;
		}
		this.view.setLoading(); 
		
		Mailman.createUser(email, nick, pass, {thi:this, nick:nick, pass:pass}, function(r, data)
		{
			data.thi.view.unsetLoading();
			if (r.ok)
				data.thi.showCongratulations(data.nick, data.pass);
			else
				new SimpleNotice('Alerta', beautify_error(r.error));
		});
	},
	showCongratulations: function(nick, pass)
	{
		clearInterval(this.interval);
		this.view.showCongratulations(nick, pass);
	},
	continueSignedIn: function(nick, pass)
	{
		Mailman.trySignin(nick, pass, true, {}, function(r, data)
		{
			if (r.ok)
			{
				Engine.destroyWelcomePage();
				Engine.signin();
				Engine.update();
				setTimeout(function()
				{
					Engine.showOfferChannels();
				}, 1000);
			} else {
				new SimpleNotice('Alerta', beautify_error(r.error));
				Engine.destroyWelcomePage();
			}
		});
	},
	update: function(){
	},
	checkAvailableEmail: function()
	{
		var email = this.view.getEmail();
		var response = Mailman.getRegUserEMail(email);
		return !response.exist;
	},
	checkAvailableNickname: function()
	{
		var nickname = this.view.getNickname();
		var response = Mailman.getRegUserNickname(nickname);
		return !response.exist;
	}
});

var Tour = Class.extend({

	init: function()
	{
		this.tips = new Array();
		this.tips.push('banner');
		this.tips.push('channel search');
		this.tips.push('user start');
		this.tips.push('main tip');
		this.next();
	},
	next: function()
	{
		if (this.view)
			this.view.destroy();

		if (this.tips.length==0)
			return;

		this.view = new TourView(this, this.tips.pop());
	},
	destroy: function()
	{
		if (this.view)
			this.view.destroy();
	}
});

var The = Class.extend({

	init: function()
	{
		this.view = new ThePage();
		this.topbar = new TopBar( );
		this.topictabs = new Object;
		this.tabs = new Tabs('maintab', HistoryTabClick);
		this.tabs.onCreateFirstTime(null, function()
		{
			if (Engine.isTourRunning())
				new FirstTabTip();
		});
		this.main = new Main(this.tabs.getFirstTab());
		this.channelslisttab = null;
		this.channeltabs = new Object;
		this.signedchannelslist = null;
		this.createchannel = null
		this.channeladmin = null;
		this.createuser = null;
		this.welcome = null;
		this.offerchannels = null;
		this.puptabs = new Object;

		if (jQuery.cookie('visitnumber')=='1')
			Engine.startTour();
	},
	selectMain:function(real)
	{
		this.main.select(real);
	},
	signin: function()
	{
		this.topbar.signin();
	},
	rebuildMain: function()
	{
		this.main.destroy();
		this.main = new Main(this.tabs.getFirstTab());
	},
	destroy: function()
	{
		this.topbar.destroy();
		this.main.destroy();
		this.tabs.destroy();
	},
	onlineUpdate: function()
	{

		this.topbar.onlineUpdate();
		if (this.topictabs!=null) for(var tmp in this.topictabs) this.topictabs[tmp].onlineUpdate();
		if (this.channeltabs!=null) for(var tmp in this.channeltabs) this.channeltabs[tmp].onlineUpdate();
		if (this.signedchannelslist!=null) this.signedchannelslist.onlineUpdate();
		if (this.channelslisttab!=null) this.channelslisttab.onlineUpdate();
		if (this.createchannel!=null) this.createchannel.onlineUpdate();
		if (this.puptabs!=null) for(var tmp in this.puptabs) this.puptabs[tmp].onlineUpdate();
		this.main.onlineUpdate();
	},
	update:function()
	{

		this.topbar.update();
		if (this.topictabs!=null) for(var tmp in this.topictabs) this.topictabs[tmp].update();
		if (this.channeltabs!=null) for(var tmp in this.channeltabs) this.channeltabs[tmp].update();
		if (this.signedchannelslist!=null) this.signedchannelslist.update();
		if (this.channelslisttab!=null) this.channelslisttab.update();
		if (this.searchchannelslisttab!=null) this.searchchannelslisttab.update();
		if (this.createchannel!=null) this.createchannel.update();
		if (this.myaccount!=null) this.myaccount.update();
		if (this.welcome) this.welcome.update();
		if (this.puptabs!=null) for(var tmp in this.puptabs) this.puptabs[tmp].update();
		this.main.update();
	},
	updateLikes:function()
	{
		if (this.topictabs!=null) for(var tmp in this.topictabs) this.topictabs[tmp].updateLikes();
		this.main.updateLikes();
	},
	addSignedChannel: function(channel){
		if (this.signedchannelslist!=null) this.signedchannelslist.addChannel(channel);
		this.main.addSignedChannel(channel);
	},
	removeSignedChannel: function(channel){
		if (this.signedchannelslist!=null) this.signedchannelslist.removeChannel(channel.id);
		this.main.removeSignedChannel(channel);
	},
	getBody: function()
	{
		return this.view.getBody();
	},
	initBigButtons: function() { this.view.initBigButtons() },
	showOfferChannels: function()
	{
		this.offerchannels = new OfferChannels();
	},
	destroyOfferChannels: function()
	{
		this.offerchannels.destroy();
		this.offerchannels = null;
	},
	showWelcomePage: function()
	{
		this.welcome = new Welcome();
	},
	destroyWelcomePage: function()
	{
		this.welcome.destroy();
		this.welcome = null;
	},
	appendTopicTab: function(id, hash)
	{
		if (this.topictabs[id]!=null)
		{
			this.topictabs[id].select(true);
			return;
		}
		var tab = this.tabs.create(null, hash);
		var t = new TopicTab(id, tab);
		tab.select(true);
		this.topictabs[id] = t;
		tab.onAfterClose({thi:this,id:id},function(data)
		{
			delete data.thi.topictabs[data.id];
		});
	},
	appendChannelTab: function(id, hash)
	{
		if (this.channeltabs[id]!=null)
		{
			var c = this.channeltabs[id];
			c.select(true);
			return;
		}
		var tab = this.tabs.create(null, hash);
		var t = new ChannelTab(id, tab);
		this.channeltabs[id] = t;
		var index = this.channeltabs.length-1;
		tab.onAfterClose({thi:this,id:id},function(data)
		{
			delete data.thi.channeltabs[data.id];
		});
		tab.select(true);
	},
	appendSearchChannelsListTab: function(words, hash)
	{
		if (this.searchchannelslisttab!=null)
		{
			this.searchchannelslisttab.select(true);
			this.searchchannelslisttab.search(words);
			return;
		}
		var tab = this.tabs.create(null, hash);
		var t = new SearchChannelsList(tab);
		tab.select(true);
		t.search(words);
		this.searchchannelslisttab = t;
		tab.onAfterClose({thi:this},function(data)
		{
			data.thi.searchchannelslisttab = null;
		});
	},
	appendCreateChannel: function(hash)
	{

		if (this.createchannel!=null)
		{
			this.createchannel.select(true);
			return
		}
		var tab = this.tabs.create(Engine.lang.tab_createyourchannel, hash);
		var t = new CreateChannel(tab);
		tab.select(true);
		this.createchannel = t;
		tab.onAfterClose({thi:this},function(data)
		{
			data.thi.createchannel = null;
		});
		
	},
	appendCreateUserTab: function(hash)
	{
		if (this.createuser)
		{
			this.createuser.tab.select(true);
			return;
		}
		var tab = this.tabs.create(null, hash);
		this.createuser = new CreateUserTab(tab);
		tab.select(true);
		tab.onAfterClose({thi:this},function(data)
		{
			data.thi.createuser = null;
		});
	},
	appendMyAccountTab: function(hash)
	{

		if (this.myaccount!=null){
			this.myaccount.select(true);
			return;
		}
		var tab = this.tabs.create(Engine.lang.tab_myaccount, hash);
		var t = new MyAccountTab(tab);
		tab.select(true);
		this.myaccount = t;
		tab.onAfterClose({thi:this},function(data)
		{
			data.thi.myaccount = null;
		});
	},
	appendChannelAdmin: function(channelid, hash)
	{

		if (this.channeladmin!=null)
		{
			this.channeladmin.select(channelid, true);
			return
		}
		var tab = this.tabs.create(null, hash);
		var t = new ChannelAdmin(channelid, tab);
		tab.select(true);
		this.channeladmin = t;
		tab.onAfterClose({thi:this},function(data)
		{
			data.thi.channeladmin = null;
		});
	},
	appendPublicUserPage: function(id, hash)
	{
		if (this.puptabs[id]!=null)
		{
			var c = this.puptabs[id];
			c.select(true);
			return;
		}
		var tab = this.tabs.create(null, hash);
		var t = new PublicUserPage(id, tab);
		this.puptabs[id] = t;
		var index = this.puptabs.length-1;
		tab.onAfterClose({thi:this,id:id},function(data)
		{
			delete data.thi.puptabs[data.id];
		});
		tab.select(true);
	}
});

var TopBar = Class.extend({

	init: function()
	{

		this.view = new TopBarSection(this);
		this.user = Engine.getMyUserSession();
		//this.channels = new TopBarChannel(this);
		if (this.user.anon)
			this.controller = new TopBarAnon(this);
		else
			this.controller = new TopBarUser(this);
		this.view.setUserTool( this.controller.getElement() );
		//this.view.setChannelTool( this.channels.getElement() );
		this.view.initMenu();
//		this.prevnickname = this.user.nickname;
		this.update();
	},
	destroy: function()
	{
		this.view.destroy();
		this.controller.destroy();
	},
	onlineUpdate: function()
	{

	},
	update: function()
	{

//		if (this.prevnickname != this.user.nickname)
//		{

//			if (this.user.anon)
//				this.controller = new TopBarAnon(this);
//			else
//				this.controller = new TopBarUser(this);

//		}
		this.controller.update();
		this.view.update();
		//this.channels.update();
//		this.prevnickname = this.user.nickname;
	},
	signin: function()
	{
		Engine.updateUserSession(true);
		if (this.controller)
			this.controller.destroy();
		this.controller = new TopBarUser(this);
		this.view.setUserTool( this.controller.getElement() );
		//this.channels = new TopBarChannel(this);
		//this.view.setChannelTool( this.channels.getElement() );
		this.view.initMenu();
		this.update();
	},
	signout: function()
	{
		Engine.updateUserSession(true);
		if (this.controller)
			this.controller.destroy();
		this.controller = new TopBarAnon(this);
		this.view.setUserTool( this.controller.getElement() );
		//this.channels = new TopBarChannel(this);
		//this.view.setChannelTool( this.channels.getElement() );
		this.view.initMenu();
		this.update();
	}
});


var ForgotPassword = Class.extend({

	init:function()
	{
		this.view = new ForgotPasswordSection(this);
	},
	resetPassword:function(email, data, callback)
	{
		data.callback_ = callback;
		var response = Mailman.resetPassword(email, data, function(r, data)
		{
			data.callback_(r, data);
		});
	}
});


var TopBarAnon = Class.extend({

	init: function(topbar)
	{
		this.topbar = topbar;
		this.view = new TopBarAnonSection(this);
	},
	destroy:function()
	{
		this.view.destroy();
	},
	update: function()
	{
	},
	getElement: function()
	{
		return this.view.getElement();
	},
	signin: function(nickemail, password, staylogged)
	{
		this.view.setWait();
		Mailman.trySignin(nickemail, password , staylogged, {thi:this}, function(r, data)
		{
			if (r.ok)
			{
				new FastNotice(Engine.lang.msg_signedin);
				data.thi.topbar.signin();
				Engine.update();
			} else
				new SimpleNotice('Alerta', beautify_error(r.error));

			data.thi.view.unsetWait();
		});
	},
	showCreateUser: function(){
		History.appendCreateUserTab();
	}
});


var TopBarUser = Class.extend({

	init: function(topbar)
	{
		this.topbar = topbar;
		this.view = new TopBarUserSection(this);
	},
	destroy:function()
	{
		this.view.destroy();
	},
	getElement: function()
	{
		return this.view.getElement();
	},
	update: function()
	{
		this.view.update();
	},
	signout: function()
	{
		this.view.setWait();
		Mailman.signout({thi:this}, function(r, data)
		{
			if (r.ok)
			{
				new FastNotice(Engine.lang.msg_signedout);
				data.thi.topbar.signout();
				Engine.update();
			} else
				new SimpleNotice('Alerta', beautify_error(r.error));
			data.thi.view.unsetWait();
		});
	},
	showMyAccount: function(){
		History.appendMyAccountTab();
	},
	showCreateChannel: function()
	{
		History.appendCreateChannel();
	}
});

var Main = Class.extend({

	init: function(tab)
	{
		this.firsttime = true;
		this.tab = tab;
		this.view = new MainPage();
		this.uft = new UFTInMain(this);

		if (Engine.getMyUserSession().anon)
		{
			this.suggestchannels = new SuggestChannelsListInMain(CONF['number_channels_suggest_in_main_anon']);
			this.view.appendInRightCol( this.suggestchannels.getElement() );
		} else {
			this.suggestchannels = new SuggestChannelsListInMain(CONF['number_channels_suggest_in_main_reg']);
			this.view.appendInRightCol( this.suggestchannels.getElement() );
			this.signedchannels = new SignedChannelsListInMain();
			this.view.appendInRightCol( this.signedchannels.getElement() );
		}

		this.recenttopics = new RecentTopicsInMain(this);
		this.view.setLeftCol( this.uft.getElement(), this.recenttopics.getElement() );
		this.tab.onBeforeSelect({thi:this}, function(data)
		{
			data.thi.visit();
		});
		this.tab.appendBannerPath(Engine.lang.tab_main);
		this.tab.setTitle(Engine.lang.tab_main);
	},
	destroy: function()
	{
		this.view.destroy();
		this.tab.resetBannerPath();
	},
	select: function(real){
		this.tab.select(real);
	},
	isSelected: function()
	{
		return this.tab.isSelected();
	},
	onlineUpdate: function()
	{
		if (this.uft!=null) this.uft.onlineUpdate(this.firsttime);
		if (this.recenttopics!=null) this.recenttopics.onlineUpdate(this.firsttime);
		if (this.signedchannels!=null) this.signedchannels.onlineUpdate();
		if (this.suggestchannels!=null) this.suggestchannels.onlineUpdate();
		this.firsttime = false;
	},
	update: function()
	{
		this.view.update();

		//if (!Engine.getMyUserSession().anon)
		//{
		//	if (this.signedchannels==null){
		//		this.signedchannels = new SignedChannelsListInMain();
		//		this.view.setRightCol( this.signedchannels.getElement() );
		//	}
		//}
		if (this.uft) this.uft.update();
		if (this.recenttopics) this.recenttopics.update();
		if (this.signedchannels) this.signedchannels.update();
		if (this.suggestchannels) this.suggestchannels.update();
	},
	updateLikes:function()
	{
		if (this.uft) this.uft.updateLikes();
		if (this.recenttopics) this.recenttopics.updateLikes();
	},
	addSignedChannel: function(channel)
	{
		if (this.signedchannels!=null) this.signedchannels.addChannel(channel);
		if (this.recenttopics!=null) this.recenttopics.addTopicsFromSignedChannel(channel.id);
	},
	removeSignedChannel: function(channel)
	{
		if (this.signedchannels!=null) this.signedchannels.removeChannel(channel.id);
		if (this.recenttopics!=null) this.recenttopics.removeChannel(channel.id);
	},
	highlight:function()
	{
		this.tab.highlight();
	},
	unhighlight:function()
	{
		this.tab.unhighlight();
	},
	visit:function()
	{
		this.unhighlight();
	}
});

var CreateChannel = Class.extend({

	init: function(tab)
	{
		this.tab = tab;
		this.view = new CreateChannelPage(this);

		this.tab.setContent( this.view.getElement() );
		var closure = (function(thi)
		{
			return function()
			{
				thi.visit();
			};
		})(this);
		this.tab.onBeforeSelect({thi:this}, function(data)
		{
			data.thi.visit();
		});
		this.tab.appendBannerPath(Engine.lang.tab_createyourchannel);
		this.tab.onBeforeClose({thi:this}, function(data)
		{
			data.thi.destroy();
		});

		Engine.getThe().initBigButtons();
	},
	onlineUpdate:function(){},
	update:function(){
		this.view.update();
	},
	createChannel:function() 
	{
		this.view.setLoading();
		var r = Mailman.createChannel(this.view.getName(), this.view.getDescription(), this.view.getLanguage(), {thi:this}, function(r, data)
		{
			data.thi.view.unsetLoading();
			if (!r.ok)
				new SimpleNotice('Alerta', beautify_error(r.error));
			else
			{
				Mailman.getChannel(r.id, {thi:data.thi}, function(channel, data)
				{
					data.thi.view.showCongratulations(channel);
				});
			}
		});
	},
	select:function(real)
	{
		this.visit();
		this.tab.select(real);
	},
	visit:function()
	{
	},
	destroy:function()
	{
	}
});

var ChannelsList = Class.extend({

	init: function()
	{
		this.view = new ChannelsListPage(this);
	},
	finalizeInit:function(channels)
	{
		this.setChannels(channels);
	},
	setChannels:function(channels)
	{
		this.channels = channels;
		this.channelsections = new Array(channels.length);
	},
	onlineUpdate:function(){},
	update:function()
	{
		if (this.channels)
			for (var i = 0; i < this.channels.length; i++)
				this.channelsections[i].update();
	},
	getElement: function()
	{
		return this.view.getElement();
	},
	select:function(real)
	{
		this.tab.select(real);
	},
	removeChannel: function(channelid){
		var idx=-1;
		if (this.channels!=null) {
			for (var i=0;i<this.channels.length;i++) {
				if (channelid==this.channels[i].id){
					this.channelsections[i].remove();
					idx=i;
					break;
				}
			}
		}
		if (idx>=0)
			this.channels.splice(idx,1);
	},
	addChannel: function(channel){
		this.channels.push(channel);
		this.channelsections.push(new ChannelPreview(channel,this));
		this.view.prependChannel( this.channelsections[this.channelsections.length-1].getElement() );
	},
	setBottomMessage: function(msg, click)
	{

	}
});

var SearchChannelsList = ChannelsList.extend({

	init: function( tab)
	{
		this._super();

		this.tab = tab;
		this.view = new SearchChannelsListPage(this);
		var closure = (function(thi)
		{
			return function()
			{
				thi.visit();
			};
		})(this);
		this.tab.onBeforeSelect({thi:this}, function(data)
		{
			data.thi.visit();
		});
		this.tab.setTitle(Engine.lang.tab_searchchannelslist);
		this.tab.appendBannerPath(Engine.lang.tab_searchchannelslist);
		this.tab.onBeforeClose({thi:this}, function(data)
		{
			data.thi.destroy();
		});
		this.tab.setContent( this.view.getElement() );
	},
	search: function(words)
	{
		this.view.clearPreviews();
		this.view.channelFound(true);
		this.view.setLoading();
		Mailman.getSearchChannelPreviews(words, {thi:this}, function(channels, data)
		{
			data.thi.setChannels(channels);
			data.thi.view.unsetLoading();
		});
	},
	setChannels:function( channels)
	{
		this._super(channels);

		this.view.clearPreviews();

		for (var i = 0; i < this.channels.length; i++)
		{
			this.channelsections[i] = new ChannelPreview(this.channels[i]);
			this.view.appendChannel( this.channelsections[i].getElement() );
		}

		if (this.channels.length > 0)
			this.view.channelFound(true);
		else
			this.view.channelFound(false);
	},
	getElement: function()
	{
		return this.view.getElement();
	},
	select:function(real)
	{
		this.tab.select(real);
	},
	visit:function()
	{
	},
	destroy:function()
	{
	}
});


var SignedChannelsListInMain = ChannelsList.extend({

	init: function()
	{
		this._super();
		this.view = new SignedChannelsListInMainPage(this);
		Mailman.getSignedChannelPreviewsIMostVisit(CONF['number_channels_signed_in_main'], {thi:this}, function(channels, data)
		{
			data.thi.finalizeInit(channels);
		});
	},
	finalizeInit:function( channels)
	{
		this._super(channels);
		this.channelsections = new Array(this.channels.length);
		for (var i = 0; i < this.channels.length; i++)
		{
			this.channelsections[i] = new ChannelLittlePreviewInMain(this.channels[i]);
			this.view.prependChannel( this.channelsections[i].getElement() );
		}
	},
	getElement: function()
	{
		return this.view.getElement();
	},
	addChannel: function(channel)
	{
		if (this.channels.length>=CONF['number_channels_signed_in_main'])
			return false;
		this.channels.push(channel);
		this.channelsections.push(new ChannelLittlePreviewInMain(channel));
		this.view.prependChannel( this.channelsections[this.channelsections.length-1].getElement() );
		return true;
	}
});

var SuggestChannelsListInMain = ChannelsList.extend({

	init: function( qtd)
	{
		this._super();
		this.view = new SuggestChannelsListInMainPage(this);
		Mailman.getRecommendedChannelPreviews(qtd, {thi:this}, function(channels, data)
		{
			data.thi.finalizeInit(channels);
		});
	},
	finalizeInit:function( channels)
	{
		this._super(channels);
		this.channelsections = new Array(this.channels.length);
		for (var i = 0; i < this.channels.length; i++)
		{
			this.channelsections[i] = new ChannelSuggestInMain(this.channels[i]);
			this.view.appendChannel( this.channelsections[i].getElement() );
		}
	},
	getElement: function()
	{
		return this.view.getElement();
	}
});

var ChannelTab = Class.extend({

	init: function(id, tab)
	{
		this.tab = tab;
		Mailman.getChannel(id, {thi:this}, function(r, data)
		{
			data.thi.channel = r;
			data.thi.finalizeInit();
		});
	},
	finalizeInit: function()
	{
		this.create_topic = new CreateTopic(this,this.channel);
		this.view = new ChannelPage(this, this.channel, this.create_topic);
		this.tab.setTitle('#'+this.getTitle());
		this.uft = new UFTInChannel(this, this.channel);
		this.recenttopics = new RecentTopicsInChannel(this, this.channel);
		this.view.setLeftCol( this.uft.getElement(), this.recenttopics.getElement() );
		this.view.setRightCol(this.create_topic.getElement());
		this.tab.setContent( this.view.getElement() );

		this.tab.onBeforeSelect({thi:this}, function(data)
		{
			data.thi.visit();
		});
		this.tab.appendBannerPath('#'+this.channel.get('name'));
		this.tab.onBeforeClose({thi:this}, function(data)
		{
			data.thi.destroy();
		});
		this.initTinyMCE();

		this.view.finalizeInit();
	},
	onlineUpdate:function()
	{

		if (this.uft!=null) this.uft.onlineUpdate();
		if (this.recenttopics!=null) this.recenttopics.onlineUpdate();
	},
	update: function()
	{
		this.view.update();
		if (this.uft!=null) this.uft.update();
		if (this.recenttopics!=null) this.recenttopics.update();
	},
	expandCreateTopic: function()
	{
		this.view.expandCreateTopic();
	},
	unexpandCreateTopic: function()
	{
		this.view.unexpandCreateTopic();
	},
	getTopic: function() { return this.topic; },
	getTitle: function()
	{
		return this.channel.name;
	},
	initTinyMCE: function()
	{
		this.create_topic.initTinyMCE();
	},
	select: function(real)
	{
		this.tab.select(real);
	},
	highlight:function()
	{
		this.tab.highlight();
	},
	unhighlight:function()
	{
		this.tab.unhighlight();
	},
	isSelected:function()
	{
		return this.tab.isSelected();
	},
	visit:function()
	{
		this.unhighlight();
	},
	destroy:function()
	{
		this.view.destroy();
	},
	subscribe:function()
	{
		this.view.setSubscriptionLoading();
		this.channel.subscribe({thi:this}, function(ok, data)
		{
			if (ok)
			{
				new FastNotice(Engine.lang.msg_subscribedchannel+data.thi.channel.get('name') +'".');
				Engine.rebuildMain();
				Engine.update();
				data.thi.view.setUnsubscribeButton();
			}
			data.thi.view.unsetSubscriptionLoading();
		});
	},
	unsubscribe:function()
	{
		this.view.setSubscriptionLoading();
		this.channel.unsubscribe({thi:this}, function(ok, data)
		{
			if (ok)
			{
				new FastNotice(Engine.lang.msg_unsubscribedchannel+ data.thi.channel.get('name') +'".');
				Engine.rebuildMain();
				Engine.update();
				data.thi.view.setSubscribeButton();
			}
			data.thi.view.unsetSubscriptionLoading();
		});
	},
	adminPanel:function()
	{
		History.appendChannelAdmin(this.channel.get('id'));
	}
});

var TopicTab = Class.extend({

	init: function(id, tab)
	{
		this.tab = tab;
		Mailman.getTopic(id, {thi:this}, function(r, data)
		{
			data.thi.topic = r.topic;
			data.thi.finalizeInit();
		});

	},
	finalizeInit:function()
	{
		this.lasttopicversion = this.topic.version;
		this.postsTab = new Array();
		this.view = new TopicTabPage(this, this.topic);
		this.tab.setTitle(this.getTitle());

		for (var i = 0; i < this.topic.posts.length; i++)
			this.appendPost(this.topic.posts[i]);

		this.tab.setContent( this.view.getElement() );

		this.tab.onBeforeSelect({thi:this}, function(data)
		{
			data.thi.visit();
		});
		this.tab.appendBannerPath('#'+this.topic.get('channel'), {cid:this.topic.get('channelid')}, function(data)
		{
			History.appendChannelTab(data.cid);
		});
		this.tab.appendBannerPath(this.getTitle());
		this.tab.onBeforeClose({thi:this}, function(data)
		{
			data.thi.destroy();
		});
		
		this.finalizedInit = true;
		this.visit();
	},
	onlineUpdate:function()
	{
	},
	update:function()
	{
		if (!this.finalizedInit)
			return;

		if (!this.tab.isSelected() && this.topic.version!=this.lasttopicversion)
			this.highlight();

		//EU COMENTEI AS 2 linhas abaixo pq qd vc da LIKE/DISLIKE FOLLOW/UNFOLLOW o version nao muda, mas precisa atualizar no view msm assim :P
		//horta: mas dai vc consome um poder computacional razoavel do browser desnecessariamente, ainda mais agora com video embutido nos
		//topicos/posts
		if (this.topic.version==this.lasttopicversion)
			return
		this.lasttopicversion = this.topic.version;
		var viewing = this.tab.isSelected();
		if (viewing)
			this.view.prepareAnimation();

		for (var i=0;i<this.topic.posts.length;i++)
		{
			if (this.topic.posts[i].inView) //topic soh pode ser visualizado em um lugar
				this.postsTab[i].update();
			else {
				this.prependPost(this.topic.posts[i]);
			}
		}
		this.view.update();

		if (viewing)
			this.view.startAnimation();

	},
	updateLikes:function()
	{
		if (!this.finalizedInit)
			return;

		for (var i=0;i<this.topic.posts.length;i++)
			this.postsTab[i].updateLikes();

		this.view.updateLikes();
	},
	highlight:function()
	{
		this.tab.highlight();
	},
	unhighlight:function()
	{
		this.tab.unhighlight();
	},
	appendPost: function(tmppost){
		var tmp2=new TopicTabPost(tmppost);
		this.postsTab.push(tmp2);
		this.view.appendPost(tmp2.getElement());
		tmppost.inView=true;
	},
	prependPost: function(tmppost){
		var tmp2=new TopicTabPost(tmppost);
		this.postsTab.push(tmp2);
		this.view.prependPost(tmp2.getElement());
		tmppost.inView=true;
	},
	getTopic: function() { return this.topic; },
	getElement: function()
	{
		return this.view.getElement();
	},
	getTitle: function()
	{
		return this.view.getTitle();
	},
	select: function(real)
	{
		this.tab.select(real);
	},
	visit: function()
	{
		this.topic.visit();
		this.tab.unhighlight();
	},
	createPost:function()
	{
		this.view.setPostLoading(true);
		var msg = this.view.getMsg();
	
		Mailman.createPost(this.topic.id, msg, {thi:this}, function(response, data)
		{
			if (!response.ok)
			{
				new SimpleNotice('Alerta', beautify_error(response.error));
			} else {
				data.thi.view.cancelPost();
				data.thi.view.bindAddPostFocusIn();
				new FastNotice(Engine.lang.msg_postcreated);
				Engine.onlineUpdateThenUpdate();
			}
			data.thi.view.setPostLoading(false);
		});

	},
	updateTopic:function()
	{
		var msg = this.view.getEditTopicMsg();
		var response = Mailman.updateTopic(this.topic.id, msg);
		if (!response.ok)
			new SimpleNotice('Alerta', beautify_error(response.error));
		else {
			new FastNotice(Engine.lang.msg_editedtopic);
			Engine.onlineUpdateThenUpdate();
		}
	},
	destroy:function()
	{
	}
});


var TopicTabPost = Class.extend({

	init: function(post)
	{
		this.post=post;
		this.view = new TopicTabPostSection(this, post);
	},
	onlineUpdate:function(){},
	update:function()
	{
		this.view.update();
	},
	updateLikes:function()
	{
		this.view.updateLikes();
	},
	getElement: function()
	{
		return this.view.getElement();
	},
	updatePost:function()
	{
		var msg = this.view.getEditPostMsg();
		var response = Mailman.updatePost(this.post.id, msg);
		if (!response.ok)
			new SimpleNotice('Alerta', beautify_error(response.error));
		else {
			new FastNotice(Engine.lang.msg_editedpost);
			Engine.onlineUpdateThenUpdate();
		}
	}
});



/********** TOPIC PREVIEWS **********/
var TopicPreviews = Class.extend({

	init: function(controller)
	{
		this.controller = controller;
		this.topicitems = new Array();
	},
	getElement: function()
	{
		return this.view.getElement();
	},
	destroyMore:function()
	{
		this.view.destroyMore();
	},
	setMaxTopicPreviews:function(n)
	{
		this.maxtopicpreviews = n;
	},
	getMaxTopicPreviews:function()
	{
		return this.maxtopicpreviews;
	},
	onlineUpdate:function()
	{
	},
	update: function()
	{
		this.view.update();
		for (var i=0;i<this.topicitems.length;i++)
			this.topicitems[i].view.update();
	},
	updateLikes:function()
	{
		for (var i=0;i<this.topicitems.length;i++)
			this.topicitems[i].view.updateLikes();
	}
});

var RecentTopics = TopicPreviews.extend({

	init:function( controller)
	{
		this._super(controller);
	}
});
var UFT = TopicPreviews.extend({

	init:function( controller)
	{
		this._super(controller);
		this.onlineUpdate(true);
	},
	onlineUpdate:function(firsttime)
	{
		if (this.channel)
			var channelid = this.channel.id;
		else
			var channelid=0;

		var data = new Object();
		data.firsttime = firsttime;
		data.thi = this;

		var handler = function(topics, data)
		{
			data.thi.finalizeOnlineUpdate(topics, data.firsttime);
		};

		//if (this.topicitems.length>0)
		//	var topics = Mailman.getNewUFT(channelid,this.topicitems[this.topicitems.length-1].getTopic().orderid,
		//	                               data, handler);
		//else
			var topics = Mailman.getNewUFT(channelid,-1,
			                               data, handler);

	},
	deleteTopicsNotIn:function(topics){
		for (var i = this.topicitems.length-1 ; i>=0;i--){
			var todelete=true;
			for (var j=0;j<topics.length;j++){
				if (this.topicitems[i].topic.id==topics[j].id)
					todelete=false;
			}
			if (todelete){
				this.topicitems[i].view.destroy();
				this.topicitems.splice(i,1);
			}
		}
	},
	finalizeOnlineUpdate:function(topics, firsttime)
	{
		var viewing = this.controller.isSelected();
		if (viewing && !firsttime)
			this.view.prepareAnimation();

		this.deleteTopicsNotIn(topics);

		var hasnew = topics.length>this.topicitems.length;

		for (var i = topics.length-1; i >= 0; i--)
			this.prependTopic(topics[i]);

		if (viewing)
		{
			if (!firsttime)
				this.view.startAnimation();
		} else
			if (hasnew)
				this.controller.highlight();

		if (firsttime)
			this.view.update();
	},
	update: function()
	{

		this._super();
		for (var i=0;i<this.topicitems.length;i++)
		{
			var topic = this.topicitems[i].getTopic();
			if (topic.sawThisVersion())
			{
				this.topicitems[i].view.destroy();
				this.topicitems.splice(i,1);
				i--;
			}
		}
	}
//	updateRepoChangesLocal: function(){
//		if (this.channel!=null)
//			var channelid = this.channel.id;
//		else
//			var channelid=0;
//		if (this.topicitems.length>0){
//			this.setTopics(Mailman.getNewUFT(channelid, this.topicitems[this.topicitems.length-1].topic.orderid).reverse());
//		} else {
//			this.setTopics(Mailman.getNewUFT(channelid, 1).reverse());
//		}
//	}
});

var RecentTopicsInMain = RecentTopics.extend({


	init:function( controller)
	{

		this._super(controller);
		this.view = new RecentTopicsInMainSection(this);
		this.setMaxTopicPreviews(CONF['number_recent_topics']);

		this.onlineUpdate(true);

	//	var id = Mailman.startSession();
	//	Mailman.wantRecentTopicsFromSignedChannels(id);
	//	Mailman.wantUFTFromSignedChannels(id);
	//	var response = Mailman.fetch(id);
	//	
	//	this.setTopics(response.followedchanneltopics.reverse());
	},
	showMore:function()
	{
		this.view.setShowMoreWait();

		var handler = function(topics, data)
		{
			data.thi.finalizeShowMore(topics);
		};

		if (this.topicitems.length>0)
			var topics = Mailman.getOldTopicsFromSignedChannels(this.topicitems[this.topicitems.length-1].getTopic().get('orderid'),
				CONF['number_recent_topics'], {thi:this}, handler);
		else
			var topics = Mailman.getOldTopicsFromSignedChannels(-1, CONF['number_recent_topics'], {thi:this}, handler);
	},
	finalizeShowMore:function(topics)
	{
		this.view.unsetShowMoreWait();

		var n = this.getMaxTopicPreviews();
		this.setMaxTopicPreviews(n+CONF['number_recent_topics']);

		for (var i = 0; i < topics.length; i++)
			this.appendTopic(topics[i]);

		if (topics.length<CONF['number_recent_topics'])
			this.destroyMore();
	},
	onlineUpdate:function(firsttime)
	{
		if (!firsttime)
			firsttime = false;
		var data = {firsttime:firsttime, thi:this};

		var handler = function(topics, data)
		{
			data.thi.finalizeOnlineUpdate(topics, data.firsttime || data.thi.topicitems.length<=0);
		};
		
		if (this.topicitems.length>0)
			var topics = Mailman.getRecentTopicsFromSignedChannels(this.topicitems[0].getTopic().orderid,
			                                                        CONF['number_recent_topics'], data, handler);
		else
			var topics = Mailman.getRecentTopicsFromSignedChannels(-1,CONF['number_recent_topics'], data, handler);
	},
	finalizeOnlineUpdate:function(topics, firsttime)
	{
		var viewing = this.controller.isSelected();
		if (viewing && !firsttime)
			this.view.prepareAnimation();

		for (var i = topics.length-1; i >= 0; i--)
			this.prependTopic(topics[i]);

		if (viewing)
		{
			if (!firsttime)
				this.view.startAnimation();
		} else {
			if (topics.length>1)
				this.controller.highlight();
			else if (topics.length>0 && topics[0].author!=(Engine.getMyUserSession()).nickname)
				this.controller.highlight();
		}

		if (firsttime)
			this.view.update();
	},
	appendTopic:function(topic)
	{
		if (this.getMaxTopicPreviews() <= this.topicitems.length)
			for (var i=this.topicitems.length-1;i>=this.getMaxTopicPreviews()-1;i--){
				this.topicitems[i].destroy();
				this.topicitems.splice(i,1);
			}

		var toInsert=true;
		for (var i=0;i<this.topicitems.length;i++){
			if (this.topicitems[i].topic.id==topic.id){
				toInsert=false;
			}
		}

		if (toInsert){
			var t = new RecentTopicItemInMain(topic);
			this.topicitems.push( t );
			this.view.appendTopic( t.getElement() );
		}
	},
	prependTopic:function(topic)
	{
		if (this.getMaxTopicPreviews() <= this.topicitems.length)
			for (var i=this.topicitems.length-1;i>=this.getMaxTopicPreviews()-1;i--){
				this.topicitems[i].destroy();
				this.topicitems.splice(i,1);
			}

		var toInsert=true;
		for (var i=0;i<this.topicitems.length;i++){
			if (this.topicitems[i].topic.id==topic.id){
				toInsert=false;
			}
		}

		if (toInsert){
			var t = new RecentTopicItemInMain(topic);
			this.topicitems.unshift( t );
			this.view.prependTopic( t.getElement() );
		}
	}
});


var RecentTopicsInChannel = RecentTopics.extend({

	init:function(controller,channel)
	{
		this.channel = channel;
		this.setMaxTopicPreviews(CONF['number_recent_topics']);
//		this.firsttime = true;
		this.view = new RecentTopicsInChannelSection(this);
		this._super(controller);

		this.onlineUpdate(true);

//		var id = Mailman.startSession();
//		Mailman.wantRecentTopicsFromChannel(id, this.channel);
		//Mailman.wantUFTFromSignedChannels(id);
//		var response = Mailman.fetch(id);

//		this.setTopics(response.recenttopics.reverse());
//		this.firsttime = false;
	},
	showMore:function()
	{
		var n = this.getMaxTopicPreviews();
		this.setMaxTopicPreviews(n+CONF['number_recent_topics']);

		if (this.topicitems.length>0)
			var topics = Mailman.getOldTopicsFromChannel(this.channel.get('id'),
				this.topicitems[this.topicitems.length-1].getTopic().get('orderid'), CONF['number_recent_topics']);
		else
			var topics = Mailman.getOldTopicsFromChannel(this.channel.get('id'),
				-1,CONF['number_recent_topics']);

		for (var i = 0; i < topics.length; i++)
			this.appendTopic(topics[i]);

		if (topics.length<CONF['number_recent_topics'])
			this.destroyMore();
	},
	onlineUpdate: function(firsttime)
	{
		var data = new Object();
		data.firsttime = firsttime;
		data.thi = this;

		var handler = function(topics, data)
		{
			data.thi.finalizeOnlineUpdate(topics, data.firsttime || data.thi.topicitems.length<=0);
		};

		if (this.topicitems.length>0)
			var ntopics = Mailman.getRecentTopicsFromChannel(this.channel.id, this.topicitems[0].getTopic().orderid,
			                                                        CONF['number_recent_topics'], data, handler);
		else
			var ntopics = Mailman.getRecentTopicsFromChannel(this.channel.id, -1, CONF['number_recent_topics'], data, handler);
	},
	finalizeOnlineUpdate: function(topics, firsttime)
	{
		var viewing = this.controller.isSelected();
		if (viewing && !firsttime)
			this.view.prepareAnimation();

		for (var i = topics.length-1; i >= 0; i--)
			this.prependTopic(topics[i]);

		if (viewing)
		{
			if (!firsttime)
				this.view.startAnimation();
		} else
			if (topics.length>0)
				this.controller.highlight();

		if (firsttime)
			this.view.update();
	},
	appendTopic:function(topic)
	{

		if (this.getMaxTopicPreviews() <= this.topicitems.length)
			for (var i=this.topicitems.length-1;i>=this.getMaxTopicPreviews()-1;i--){
				this.topicitems[i].destroy();
				this.topicitems.splice(i,1);
			}

		var toInsert=true;
		for (var i=0;i<this.topicitems.length;i++){
			if (this.topicitems[i].topic.id==topic.id){
				toInsert=false;
			}
		}

		if (toInsert){
			var t = new RecentTopicItemInChannel(topic);
			this.topicitems.push( t );
			this.view.appendTopic( t.getElement() );
		}
	},
	prependTopic:function(topic)
	{
		if (this.getMaxTopicPreviews() <= this.topicitems.length)
			for (var i=this.topicitems.length-1;i>=this.getMaxTopicPreviews()-1;i--){
				this.topicitems[i].destroy();
				this.topicitems.splice(i,1);
			}

		var toInsert=true;
		for (var i=0;i<this.topicitems.length;i++){
			if (this.topicitems[i].topic.id==topic.id){
				toInsert=false;
			}
		}

		if (toInsert){
			var t = new RecentTopicItemInChannel(topic);
			this.topicitems.unshift( t );
			this.view.prependTopic( t.getElement() );
		}
	}
});


var UFTInMain = UFT.extend({


	init:function( controller)
	{
		this.view = new UFTInMainSection(this);
		this._super(controller);
	},
	showMore:function()
	{

	},
	appendTopic:function(topic)
	{
		var toInsert=true;
		for (var i=0;i<this.topicitems.length;i++){
			if (this.topicitems[i].topic.id==topic.id){
				toInsert=false;
			}
		}

		if (toInsert){
			var t = new UFTItemInMain(topic);
			this.topicitems.push( t );
			this.view.appendTopic( t.getElement() );
		}
	},
	prependTopic:function(topic)
	{
		var toInsert=true;
		for (var i=0;i<this.topicitems.length;i++){
			if (this.topicitems[i].topic.id==topic.id){
				toInsert=false;
			}
		}

		if (toInsert){
			var t = new UFTItemInMain(topic);
			this.topicitems.push( t );
			this.view.prependTopic( t.getElement() );
		}
	}
//	setTopics: function(topics)
//	{
//		for (var i = 0; i < topics.length; i++)
//		{
//			var t = new UFTItemInMain(topics[i]);
//			this.topicitems.push( t );
//			this.view.prependTopic( t.getElement() );
//		}
//	}
});

var UFTInChannel = UFT.extend({


	init:function( controller, channel)
	{
		this.channel = channel;
		this.view = new UFTInChannelSection(this);
		this._super(controller);
	},
	showMore:function()
	{

	},
	appendTopic:function(topic)
	{
		var toInsert=true;
		for (var i=0;i<this.topicitems.length;i++){
			if (this.topicitems[i].topic.id==topic.id){
				toInsert=false;
			}
		}

		if (toInsert){
			var t = new UFTItemInChannel(topic);
			this.topicitems.push( t );
			this.view.appendTopic( t.getElement() );
		}
	},
	prependTopic:function(topic)
	{
		var toInsert=true;
		for (var i=0;i<this.topicitems.length;i++){
			if (this.topicitems[i].topic.id==topic.id){
				toInsert=false;
			}
		}

		if (toInsert){
			var t = new UFTItemInChannel(topic);
			this.topicitems.push( t );
			this.view.prependTopic( t.getElement() );
		}
	}
//	setTopics: function(topics)
//	{
//		for (var i = 0; i < topics.length; i++)
//		{
//			var t = new UFTItemInChannel(topics[i]);
//			this.topicitems.push( t );
//			this.view.prependTopic( t.getElement() );
//		}
//	}
});
/********** TOPIC PREVIEWS **********/



/********** TOPIC PREVIEW ITEM **********/
var TopicPreviewItem = Class.extend({


	init:function(view, topic)
	{
		this.view = view;
		this.topic = topic;
		this.lasttopicversion = topic.version;
	},
	getElement:function()
	{
		return this.view.getElement();
	},
	getTopic:function()
	{
		return this.topic;
	},
	onlineUpdate:function() {},
	update:function()
	{
		this.view.update();
	},
	destroy: function(){
		this.view.destroy();
	}
});

var RecentTopicItem = TopicPreviewItem.extend({

	init:function( view, topic)
	{
		this._super(view, topic);
		this.view.setTopicTitleClickCallback(function(event)
		{
			History.appendTopicTab(event.data.tid);
//			var response = Mailman.visitTopic(event.data.tid);
//			if (response.ok)
//				Engine.removeUFT(event.data.tid);
			return false;
		}, {tid:topic.id});
	}
});

var UFTItem = TopicPreviewItem.extend({

	init:function( view, topic)
	{
		this._super(view, topic);
		this.view.setTopicTitleClickCallback(function(event)
		{
			History.appendTopicTab(event.data.tid);
//			var response = Mailman.visitTopic(event.data.tid);
//			if (response.ok)
//				Engine.removeUFT(event.data.tid);

			return false;
		}, {tid:topic.id});
	}
});

var RecentTopicItemInMain = RecentTopicItem.extend({

	init:function( topic)
	{

		this._super(new RecentTopicItemInMainSection(this,topic), topic);
	}
});

var RecentTopicItemInChannel = RecentTopicItem.extend({

	init:function( topic)
	{
		this._super(new RecentTopicItemInChannelSection(this,topic), topic);
	}
});

var UFTItemInMain = UFTItem.extend({

	init:function( topic)
	{
		this._super(new UFTItemInMainSection(this,topic), topic);
	}
});

var UFTItemInChannel = UFTItem.extend({

	init:function( topic)
	{
		this._super(new UFTItemInChannelSection(this,topic), topic);
	}
});
/********** TOPIC PREVIEW ITEM **********/


var CreateTopic = Class.extend({

	init: function(controller, channel)
	{
		this.controller = controller;
		this.channel = channel;
		this.view = new CreateTopicSection(this, channel);
		if (!channel.canICreateTopic())
			this.setCannotCreateTopic();
	},
	showAdvancedButtons:function()
	{
		this.view.showAdvancedButtons();
	},
	hideAdvancedButtons:function()
	{
		this.view.hideAdvancedButtons();
	},
	setCannotCreateTopic: function()
	{
		this.view.setCannotCreateTopic();
	},
	getElement: function()
	{
		return this.view.getElement();
	},
	setElement: function(e)
	{
		this.view.setElement(e);
	},
	initTinyMCE: function()
	{
		this.view.initTinyMCE();
	},
	setWidth: function(width)
	{
		this.view.setWidth(width);
	},
	getWidth: function()
	{
		return this.view.getWidth();
	},
	setHeight: function(height)
	{
		this.view.setHeight(height);
	},
	getHeight: function()
	{
		return this.view.getHeight();
	},
	setPlaceholderWidth: function(width)
	{
		this.view.setPlaceholderWidth(width);
	},
	getPlaceholderWidth: function()
	{
		return this.view.getPlaceholderWidth();
	},
	setPlaceholderHeight: function(height)
	{
		this.view.setPlaceholderHeight(height);
	},
	getPlaceholderHeight: function()
	{
		return this.view.getPlaceholderHeight();
	},
	createTopic:function()
	{
		this.view.disable();
		this.view.setLoading(true);
		var subject = this.view.getSubject();
		var msg = this.view.getMsgBody();
		Mailman.createTopic(this.channel.id, subject, msg, {thi:this}, function(response, data)
		{
			data.thi.view.setLoading(false);
			data.thi.view.enable();
			if (!response.ok)
				new SimpleNotice('Alerta', beautify_error(response.error));
			else
			{
				data.thi.view.clear();
				new FastNotice(Engine.lang.msg_topiccreated);
				Engine.onlineUpdateThenUpdate();
				data.thi.controller.unexpandCreateTopic();
			}
		});
	},
	setExpandCallback: function(cb)
	{
		this.view.setExpandCallback(cb);
	},
	setUnexpandCallback: function(cb)
	{
		this.view.setUnexpandCallback(cb);
	},
	destroy: function()
	{
		this.view.destroy();
	}
});

var CreateUserTab = Class.extend({

	init: function(tab)
	{
		this.tab = tab;
		this.view = new CreateUserPage(this);
	},
	finalizeInit:function()
	{
		this.tab.setTitle(Engine.lang.tab_createaccount);
		this.tab.setContent( this.view.getElement() );
		Engine.getThe().initBigButtons();
		var closure = (function(thi)
		{
			return function()
			{
				thi.visit();
			};
		})(this);
		this.tab.onBeforeSelect({thi:this}, function(data)
		{
			data.thi.visit();
		});
		this.tab.appendBannerPath(Engine.lang.tab_createaccount);
		this.tab.onBeforeClose({thi:this}, function(data)
		{
			data.thi.destroy();
		});
	},
	getElement: function()
	{
		return this.view.getElement();
	},
	onlineUpdate:function() {},
	update:function() {},
	createUser:function()
	{
		var email = this.view.getEmail();
		var nickname = this.view.getNickname();
		var password = this.view.getPassword();
		var password2 = this.view.getPassword2();
		if (password!=password2)
			new SimpleNotice('Alerta', 'Senhas diferentes.');

		this.view.setLoading();

		var response = Mailman.createUser(email, nickname, password, {thi:this}, function(r, data)
		{
			// TODO:o jeito que pega nickname e email
			// ta cagado
			if (r.ok)
				data.thi.view.showCongratulations(nickname, email, password);
			else
				new SimpleNotice('Alerta', beautify_error(r.error));

			data.thi.view.unsetLoading();

		});
	},
	checkLettersEmail: function()
	{
		//TODO:usar util.checkEmailValidity
		var email = this.view.getEmail();
		var str=email;
		var at="@";
		var dot=".";
		var lat=str.indexOf(at);
		var lstr=str.length;
		var ldot=str.indexOf(dot);
		if (str.indexOf(at)==-1){
		   return false;
		}
	
		if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
		   return false;
		}
	
		if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
		    return false;
		}
	
		 if (str.indexOf(at,(lat+1))!=-1){
		    return false;
		 }
	
		 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
		    return false;
		 }
	
		 if (str.indexOf(dot,(lat+2))==-1){
		    return false;
		 }
		
		 if (str.indexOf(" ")!=-1){
		    return false;
		 }
	
	 	 return true;
	},
	checkAvailableEmail: function()
	{
		var email = this.view.getEmail();
		var response = Mailman.getRegUserEMail(email);
		return !response.exist;
	},
	checkAvailableNickname: function()
	{
		var nickname = this.view.getNickname();
		var response = Mailman.getRegUserNickname(nickname);
		return !response.exist;
	},
	checkPasswords: function()
	{
		var p1 = this.view.getPassword();
		var p2 = this.view.getPassword2();
		return p1==p2;
	},
	visit: function()
	{
	},
	destroy:function()
	{
	},
	continueSignedIn: function(nick, pass)
	{
		Mailman.trySignin(nick, pass, true, {}, function(r, data)
		{
			if (r.ok)
			{
				Engine.signin();
				Engine.update();
				Engine.showOfferChannels();
			} else {
				new SimpleNotice('Alerta', beautify_error(r.error));
			}
		});
	}
});

var MyAccountTab = Class.extend({

	init: function(tab)
	{
		jQuery.getScript('js/ajaxfileupload.js');
		this.tab = tab;
		this.view = new MyAccountPage(Engine.user, this);
		tab.setContent( this.view.getElement() );
		Engine.getThe().initBigButtons();
		var closure = (function(thi)
		{
			return function()
			{
				thi.visit();
			};
		})(this);
		this.tab.onBeforeSelect({thi:this}, function(data)
		{
			data.thi.visit();
		});
		this.tab.appendBannerPath(Engine.lang.tab_myaccount);
		this.tab.onBeforeClose({thi:this}, function(data)
		{
			data.thi.destroy();
		});

	},
	getElement: function()
	{
		return this.view.getElement();
	},
	onlineUpdate:function()
	{

	},
	update:function()
	{

	},
	updateUser:function()
	{
		this.view.setLoading();
		var password = this.view.getPassword();
		var signature = this.view.getSignature();
		var lang = this.view.getLanguage();
		var email_mytopics = this.view.getEmailMyTopics();
		var email_mychannels = this.view.getEmailMyChannels();
		var email_followedtopics = this.view.getEmailFollowedTopics();
		var email_followedchannels = this.view.getEmailFollowedChannels();
		var response = Mailman.updateUser(password, signature, lang, email_mytopics, email_followedtopics, email_mychannels, email_followedchannels, {thi:this}, function(r, data)
		{
			data.thi.view.unsetLoading();
			if (!r.ok)
				new SimpleNotice('Alerta', beautify_error(r.error));
			else {
				new FastNotice(Engine.lang.msg_profileupdated);
				Engine.updateLang();
			}
		});
	},
	checkPasswords: function()
	{
		var p1 = this.view.getPassword();
		var p2 = this.view.getPassword2();
		return p1==p2;
	},
	updateAvatar: function()
	{
		this.view.updateAvatar();
	},
	crop: function(filename, cid, x1, x2, y1, y2 )
	{
		Mailman.updateAvatar(filename, cid, x1, x2, y1, y2, {thi:this}, function(data)
		{
			if (data.ok)
			{
				Engine.updateUserSession(false);
				Engine.update();
				data.thi.updateAvatar();
			} else
				new SimpleNotice('Alerta', beautify_error(data.error));
		});
	},
	select: function(real)
	{
		this.tab.select(real);
	},
	uploadTmpAvatar: function()
	{
		Mailman.uploadTmpAvatar(this.view.getFileElementId(), {thi:this}, function(data)
		{
			if (data.ok)
				data.thi.showAvatarEdition(data.filename);
			else
				new SimpleNotice('Alerta', beautify_error(data.error));
		});
	},
	showAvatarEdition: function(filename)
	{
		this.view.showAvatarEdition(filename);
	},
	visit: function()
	{
	},
	destroy:function()
	{
	}
});

var ChannelAdmin = Class.extend({

	init: function(channelid, tab)
	{
		this.channelid = channelid;
		this.tab = tab;
		jQuery.getScript('js/ajaxfileupload.js');

		this.channels = Mailman.getMyChannels();
		this.view = new ChannelAdminPage(this, this.channels, this.channelid, this.descriptionbox);
		this.tab.setContent( this.view.getElement() );
		Engine.getThe().initBigButtons();

		this.tab.onBeforeSelect({thi:this}, function(data)
		{
			data.thi.visit();
		});
		this.tab.appendBannerPath(Engine.lang.tab_channeladmin);
		this.tab.onBeforeClose({thi:this}, function(data)
		{
			data.thi.destroy();
		});
		this.tab.setTitle(Engine.lang.tab_channeladmin);
	},
	saveChanges: function()
	{
		this.view.setLoading();
		var channel = this.view.getChannel()
		channel.haslogo = this.view.getHaslogo();
		channel.description = this.view.getDescription();
		channel.perm_member = this.view.getPermMember();
		channel.perm_reguser = this.view.getPermReguser();
		channel.perm_anon = this.view.getPermAnon();
		channel.lang = this.view.getLanguage();
		channel.asktofollow = this.view.getAskToFollow();
		channel.save({thi:this}, function(r, data)
		{
			data.thi.view.unsetLoading();
			new FastNotice(Engine.lang.msg_channelupdated);
			Engine.update();
		});
			
	},
	cancelChanges: function()
	{
		this.view.build();
		new FastNotice('Alterações canceladas.');
	},
	onlineUpdate:function()
	{
	},
	update:function()
	{
	},
	showLogoEdition: function(filename)
	{
		this.view.showLogoEdition(filename);
	},
	updateLogo: function()
	{
		this.view.updateLogo();
	},
	crop: function(filename, cid, x1, x2, y1, y2 )
	{
		Mailman.updateLogo(filename, cid, x1, x2, y1, y2, {thi:this,cid:cid}, function(r, data)
		{
			if (r.ok)
			{
				Mailman.getChannel(data.cid, {thi:data.thi}, function(r, data)
				{
					data.thi.updateLogo();
				});
			} else
				new SimpleNotice('Alerta', beautify_error(r.error));
		});
	},
	uploadTmpLogo: function()
	{
		Mailman.uploadTmpLogo(this.view.getFileElementId(), {thi:this}, function(data)
		{
			if (data.ok)
				data.thi.showLogoEdition(data.filename);
			else
				new SimpleNotice('Alerta', beautify_error(data.error));
		});
	},
	getElement: function() { return this.element; },
	select: function(channelid, real)
	{
		this.tab.select(real);
		if (channelid!=null)
			this.view.selectTab(channelid);
	},
	visit:function()
	{
	},
	destroy:function()
	{
	}
});

var Mailman = new function MAILMAN()
{
	this.initialize = function()
	{

		this.sessions = new Object;
		this.scounter = 0;
	}
	this.destroy = function()
	{
		this.sessions = null;
		this.scounter = null;
	}
	this.startSession = function()
	{
		var id = ( (this.scounter++)*10000 + Math.floor( Math.random() * 10000 ) ) + '';
		this.sessions[id] = '';
		return id;
	}
	this.fetch = function(id, func)
	{
		var s = this.sessions[id].substr(0,this.sessions[id].length-2);
		delete this.sessions[id];
		var arr = s.split('&&');
		var what = 'what=';
		var query = '&';
		for (var i = 0; i < arr.length; i++)
		{
			what += arr[i].split('&', 1)[0] + ',';
			var t = arr[i].match(/^[^&]+&(.*)$/);
			if (t)
				query += t[1] + '&';
		}

		what = what.substr(0, what.length-1);
		query = query.substr(0, query.length-1);

		if (func==null)
		{
			var response = jQuery.parseJSON( jQuery.ajax({

				url:'../engine.php?'+what,
				dataType:'json',
				data:query,
				async:false,
				type:'GET',
				error:function()
				{
					console.log('error on controller.Mailman.fetch');
				}
			}).responseText );

			return this.processResponse(response);

		} else {
			jQuery.getJSON('engine.php?'+what, query, function(response)
			{
				func(this.processResponse(response));
			});
		}
	};
	this.processResponse = function(response)
	{
		var result = new Object();

		var processTopics = function(jsonTopics)
		{
			var topics = new Array(jsonTopics.length);
			for (var i = 0; i < jsonTopics.length; i++)
			{
				var topic = Repository.createTopic(jsonTopics[i]);
				topics[i] = topic;
			}
			return topics;
		};
		var processTopicsAndPosts = function(jsonTopicsAndPosts)
		{
			var topics = new Array(jsonTopicsAndPosts.length);
			for (var i = 0; i < jsonTopicsAndPosts.length; i++)
			{
				var tmp;
				tmp = jsonTopicsAndPosts[i].topic;
				tmp.posts=jsonTopicsAndPosts[i].posts.reverse();
				topics[i] = processTopic(tmp);
			}
			return topics;
		};
		var processTopic = function(jsonTopic)
		{
			return Repository.createTopic(jsonTopic,true);
		};

		var processPosts = function(jsonPosts){
			var posts = new Array(jsonPosts.length);
			for (var i = 0; i < jsonPosts.length; i++)
			{
				var post = Repository.createPost(jsonPosts[i]);
				posts[i] = post;
			}
			return posts;
		};

		var processUser = function(jsonUser)
		{
			return Repository.createUser(jsonUser);
		};
		var processUsers = function(jsonUsers)
		{
			var users = new Array(jsonUsers.length);
			for (var i = 0; i < jsonUsers.length; i++)
				users[i] = Repository.createUser(jsonUsers[i]);
			return users;
		};

		var processChannels = function(jsonChannels)
		{
			var channels = new Array(jsonChannels.length);
			for (var i = 0; i < jsonChannels.length; i++)
			{
				channels[i] = Repository.createChannel(jsonChannels[i]);
			}
			return channels;
		};

		if (response.lang!=null){
			result.lang = Repository.createLANG(response.lang);
		}
		if (response.refresh_topic_previews != null) {
			result.refresh_topic_previews = processTopics(response.refresh_topic_previews);
		}
		if (response.refresh_topics != null) {
			result.refresh_topics = processTopicsAndPosts(response.refresh_topics);
		}
		if (response.recenttopics != null)
		{
			result.recenttopics = processTopics(response.recenttopics[0]);
		}
		if (response.uft != null)
		{
			result.uft = processTopics(response.uft[0]);
		}
		if (response.followedchanneltopics != null)
		{
			result.followedchanneltopics = processTopics(response.followedchanneltopics);
		}
		if (response.new_topic_previews != null)
		{
			result.new_topic_previews = processTopics(response.new_topic_previews[0]);
		}
		if (response.topic != null)
		{
			result.topic = processTopic(response.topic.topic);
			result.topic.posts = processPosts(response.topic.posts);
		}
		if (response.user != null)
		{
			result.user = processUser(response.user);
		}
		if (response.userscamefrom)
		{
			result.userscamefrom = processUsers(response.userscamefrom);
		}
		if (response.searchmain != null){
			result.searchmain = processChannels(response.searchmain.channels);
		}
		if (response.channels != null)
		{
			result.channels = processChannels(response.channels);
		}
		if (response.mychannels != null)
		{
			result.mychannels = processChannels(response.mychannels);
		}
		if (response.recommendedchannels != null)
		{
			result.recommendedchannels = processChannels(response.recommendedchannels);
		}
		if (response.followedchannels != null)
		{
			result.followedchannels = processChannels(response.followedchannels);
		}
		if (response.mostvisitedchannels != null)
		{
			result.mostvisitedchannels = processChannels(response.mostvisitedchannels);
		}
		return result;
	};
	this.getTemplate = function(name, data, func)
	{
		var template = Repository.getTemplate(name);
		if (!func)
		{
			if (!template)
			{
				var t = jQuery.ajax(
				{
					url: '../html/'+name+'.html',
					async:false,
					error: function()
					{
						console.log('error in Mailman.getTemplate');
					}
				}).responseText;

				t = jQuery(t);
				Repository.addTemplate(name, t);
				return t.clone();
			} else
				return template.clone();

		} else {
			if (!template)
			{
				var closure = (function(name, data, func)
				{
					return function(e)
					{
						e = jQuery(e);
						Repository.addTemplate(name, e);
						func( data, e.clone() );
					};
				})(name, data, func);
				jQuery.get('../html/'+name+'.html', closure);
			} else
				func(data, template.clone());
		}
	};
	this.wantRecentTopicsFromSignedChannels = function(id)
	{
		this.sessions[id] = this.sessions[id] + 'followedchanneltopics&&';
	};
	this.wantRecentTopicsFromChannel = function(id, channel)
	{
		this.sessions[id] = this.sessions[id] + 'recenttopics&idchannel_recenttopics='+channel.id+'&&';
	};
	this.wantUFTFromSignedChannels = function(id)
	{
		this.sessions[id] = this.sessions[id] + 'uft&idchannel_uft=0&&';
	};
	this.getTopic = function(id, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json),data);
			};
		})(this, data, suc);
		jQuery.getJSON('engine.php?what=topic&id_topic='+id,closure).error(function()
		{
			console.log('error on controller.Mailman.getTopic');
		});
	}
	this.getRefreshTopicPreviews = function(ids, versions, data, suc)
	{
		if (!data) data = {};
		if (!suc) suc = function(){};

		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json),data);
			};
		})(this, data, suc);

		var url = 'engine.php?what=refresh_topic_previews&ids_refresh_topic_previews='+ids+'&versions_refresh_topic_previews='+versions;
		jQuery.getJSON(url,closure).error(function()
		{
			console.log('error on controller.Mailman.getRefreshTopicPreviews');
		});
	};
	this.getRefreshTopics = function(ids, versions, data, suc)
	{
		if (!data) data = {};
		if (!suc) suc = function(){};

		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json),data);
			};
		})(this, data, suc);

		var url = 'engine.php?what=refresh_topics&ids_refresh_topics='+ids+'&versions_refresh_topics='+versions;
		jQuery.getJSON(url,closure).error(function()
		{
			console.log('error on controller.Mailman.getRefreshTopics');
		});
	};
	this.getChannel = function(id, data, suc)
	{
		if (!data) data = {};
		if (!suc) suc = function(){};

		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(Repository.createChannel(json.channel.channel),data);
			};
		})(this,data,suc);
		jQuery.getJSON('engine.php?what=channel&id_channel='+id,closure).error(function()
		{
			console.log('error on controller.Mailman.getChannel');
		});
	};
	this.getAllChannelPreviews = function(data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).channels, data);
			};
		})(this, data, suc);
		jQuery.getJSON('engine.php?what=channels',closure).error(function()
		{
			console.log('error on controller.Mailman.getAllChannelPreviews');
		});
	};
	this.getRecommendedChannelPreviews = function(n, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).recommendedchannels, data);
			};
		})(this, data, suc);
		jQuery.getJSON('engine.php?what=recommendedchannels&qtd_recommendedchannels='+n,closure).error(function()
		{
			console.log('error on controller.Mailman.getRecommendedChannelPreviews');
		});
	};
	this.getSignedChannelPreviews = function(data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).followedchannels, data);
			};
		})(this, data, suc);
		jQuery.getJSON('engine.php?what=followedchannels',closure).error(function()
		{
			console.log('error on controller.Mailman.getSignedChannelPreviews');
		});
	};
	this.getSearchChannelPreviews = function(words,data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).searchmain, data);
			};
		})(this, data, suc);
		var response = jQuery.ajax({
			url:'engine.php?what=searchmain',
			dataType:'json',
			type:'GET',
			data:'words_searchmain='+escape_ampersand(words),
			success: closure,
			error:function()
			{
				console.log('error on controller.Mailman.getSearchChannelPreview');
			}
		});
	};
	this.getSignedChannelPreviewsIMostVisit = function(n, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).mostvisitedchannels, data);
			};
		})(this, data, suc);
		jQuery.getJSON('engine.php?what=mostvisitedchannels&signed_mostvisitedchannels=1&qtd_mostvisitedchannels='+n,closure).error(function()
		{
			console.log('error on controller.Mailman.getSignedChannelPreviewsIMostVisit');
		});
		/*var closure = (function(n, suc)
		{
			return function(channels, dat)
			{
				suc(channels.slice(0,n), dat);
			};
		})(n, suc);
		this.getSignedChannelPreviews(data, closure);*/
	};
	this.getMyUserSession = function()
	{
		var response = jQuery.parseJSON( jQuery.ajax({
			url:'engine.php?what=user',
			dataType:'json',
			async:false,
			error:function()
			{
				console.log('error on controller.Mailman.getMyUserSession');
			}
		}).responseText );
		return this.processResponse(response).user;
	}
	this.trySignin = function(nickemail, pass, staylogged, data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{
				if (json.signin.ok)
					r = {ok:true, error:''};
				else
					r = {ok:false, error:json.signin.error};
				suc(r, data);
			};
		})(data, suc);

		jQuery.ajax(
		{
			url:'engine.php?what=signin',
			type:'POST',
			dataType:'json',
			data:{'nickname_signin':nickemail,'password_signin':pass,'staysignedin_signin':staylogged},
			success:closure,
			error:function()
			{
				console.log('error on controller.Mailman.trySignin');
			}
		});
	};
	this.signout = function(data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{
				if (json.signout.ok)
					r = {ok:true, error:''};
				else
					r = {ok:false, error:json.signout.error};
				suc(r, data);
			};
		})(data, suc);

		jQuery.getJSON('engine.php?what=signout',closure).error(function()
		{
			console.log('error on controller.Mailman.signout');
		});
	};
	this.subscribeChannels = function(channelids, data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{
				suc(json.followchannels, data);
			};
		})(data, suc);

		jQuery.getJSON('engine.php?what=followchannels&channelids_followchannels='+channelids.join(','),closure).error(function()
		{
			console.log('error on controller.Mailman.subscribeChannels');
		});
	};
	this.subscribeChannel = function(channelid, data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{
				suc(json.followchannel, data);
			};
		})(data, suc);


		jQuery.getJSON('engine.php?what=followchannel&channelid_followchannel='+channelid,closure).error(function()
		{
			console.log('error on controller.Mailman.subscribeChannel');
		});
	};
	this.unsubscribeChannel = function(channelid, data, suc)
	{

		var closure = (function(data, suc)
		{
			return function(json)
			{
				suc(json.unfollowchannel, data);
			};
		})(data, suc);


		jQuery.getJSON('engine.php?what=unfollowchannel&channelid_unfollowchannel='+channelid,closure).error(function()
		{
			console.log('error on controller.Mailman.unsubscribeChannel');
		});
	};
	this.likedislikeTopic = function(topicid, liked, data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{

				if (json.like_dislike_this.ok)
				{
					var r = {ok:true, error:''};
				} else
					var r = {ok:false, error:json.like_dislike_this.error};

				suc(r, data);
			};
		})(data, suc);

		jQuery.getJSON('engine.php?what=like_dislike_this&op=topic&liked='+liked+'&topicid='+topicid, closure).error(function()
		{
			console.log('error on controller.Mailman.likedislikeTopic');
		});
	};
	this.likedislikePost = function(postid, liked, data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{

				if (json.like_dislike_this.ok)
				{
					var r = {ok:true, error:''};
				} else
					var r = {ok:false, error:json.like_dislike_this.error};

				suc(r, data);
			};
		})(data, suc);

		jQuery.getJSON('engine.php?what=like_dislike_this&op=post&liked='+liked+'&postid='+postid, closure).error(function()
		{
			console.log('error on controller.Mailman.likedislikePost');
		});
	};
	this.createPost = function(tid, msg, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(response)
			{
				suc({ok:response.add_post.ok, error:response.add_post.error},data);
			};
		})(this,data,suc);

		var response = jQuery.ajax({
			url:'../engine.php?what=add_post&topicid_add_post='+tid,
			dataType:'json',
			type:'POST',
			data:'msg='+escape_ampersand(msg),
			success: closure,
			error:function()
			{
				console.log('error on controller.Mailman.createPost');
			}
		});
	}
	this.createTopic = function(cid, subject, msg, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(response)
			{
				suc({ok:response.add_topic.ok, error:response.add_topic.error},data);
			};
		})(this,data,suc);
		
		var response = jQuery.ajax({
			url:'engine.php?what=add_topic&channelid_add_topic='+cid,
			dataType:'json',
			type:'POST',
			data:{'subject':subject,'msg':msg},
			success: closure,
			error:function()
			{
				console.log('error on controller.Mailman.createTopic');
			}
		});
	}
	this.updateTopic = function(tid, msg)
	{
		
		var response = jQuery.parseJSON( jQuery.ajax({
			url:'engine.php?what=update_topic&topicid_update_topic='+tid,
			dataType:'json',
			async:false,
			type:'POST',
			data:{'msg_update_topic':msg},
			error:function()
			{
				console.log('error on controller.Mailman.updateTopic');
			}
		}).responseText );
		return {ok:response.update_topic.ok, error:response.update_topic.error};
	}
	this.followTopic = function(tid)
	{
		
		var response = jQuery.parseJSON( jQuery.ajax({
			url:'../engine.php?what=followtopic&topicid_followtopic='+tid,
			dataType:'json',
			async:false,
			error:function()
			{
				console.log('error on controller.Mailman.followTopic');
			}
		}).responseText );
		return {ok:response.followtopic.ok, error:response.followtopic.error};
	}
	this.unfollowTopic = function(tid)
	{
		
		var response = jQuery.parseJSON( jQuery.ajax({
			url:'../engine.php?what=unfollowtopic&topicid_unfollowtopic='+tid,
			dataType:'json',
			async:false,
			error:function()
			{
				console.log('error on controller.Mailman.unfollowTopic');
			}
		}).responseText );
		return {ok:response.unfollowtopic.ok, error:response.unfollowtopic.error};
	}

	this.createPost = function(tid, msg, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(response)
			{
				suc({ok:response.add_post.ok, error:response.add_post.error},data);
			};
		})(this,data,suc);

		var response = jQuery.ajax({
			url:'engine.php?what=add_post&topicid_add_post='+tid,
			dataType:'json',
			type:'POST',
			data:{'msg':msg},
			success: closure,
			error:function()
			{
				console.log('error on controller.Mailman.createPost');
			}
		});
	}
	this.updatePost = function(pid, msg)
	{
		var response = jQuery.parseJSON( jQuery.ajax({
			url:'../engine.php?what=update_post&postid_update_post='+pid,
			dataType:'json',
			async:false,
			type:'POST',
			data:{'msg_update_post':msg},
			error:function()
			{
				console.log('error on controller.Mailman.updatePost');
			}
		}).responseText );
		return {ok:response.update_post.ok, error:response.update_post.error};
	}
	this.createChannel = function(name, description, language, data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{
				r={ok:json.add_channel.ok, error:json.add_channel.error, id:json.add_channel.id};
				suc(r, data);
			};
		})(data, suc);

		jQuery.ajax({
			url:'../engine.php?what=add_channel',
			dataType:'json',
			type:'POST',
			data:{'name':escape_ampersand(name),'description':escape_ampersand(description),'lang':language},
			success: closure,
			error:function()
			{
				console.log('error on controller.Mailman.createChannel');
			}
		});
	}
	this.updateChannel = function(id, description, language, asktofollow, perm_member, perm_reguser, perm_anon, data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{
				r={ok:json.update_channel.ok, error:json.update_channel.error};
				suc(r,data);
			};
		})(data, suc);

		jQuery.ajax({
			url:'../engine.php?what=update_channel&channelid_update_channel='+id,
			dataType:'json',
			type:'POST',
			data:{'description':escape_ampersand(description),'lang':language,'asktofollow':asktofollow, 'perm_member':perm_member, 'perm_reguser':perm_reguser,'perm_anon':perm_anon},
			success: closure,	
			error:function()
			{
				console.log('error on controller.Mailman.updateChannel ');
			}
		});
	}
	this.checkChannelName = function(name, data, callback)
	{
		jQuery.ajax({
			url:'engine.php?what=regchannel',
			dataType:'json',
			type:'GET',
			data:{'name_regchannel':name},
			success:function(json)
			{
				callback({ok:json.regchannel.ok, error:json.regchannel.error, exist:json.regchannel.exist, prettyUrl:json.regchannel.prettyUrl}, data);
			},
			error:function()
			{
				console.log('error on controller.Mailman.checkChannelName');
			}
		});
	};
	this.getFrom = function(id, data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{
				suc(json.fromname, data);
			};
		})(data, suc);

		jQuery.ajax({
			url:'engine.php?what=fromname&id_fromname='+id,
			dataType:'json',
			type:'GET',
			success:closure,
			error:function()
			{
				console.log('error on controller.Mailman.getFrom');
			}
		});
	};
	this.createUser = function(email, nickname, password, data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{
				suc({ok:json.create_account.ok, error:json.create_account.error}, data);
			};
		})(data, suc);

		jQuery.ajax({
			url:'engine.php?what=create_account',
			dataType:'json',
			type:'POST',
			data:{'email_create_account':email,'nickname_create_account':nickname,'password_create_account':password},
			success:closure,
			error:function()
			{
				console.log('error on controller.Mailman.createUser');
			}
		});
	};
	this.updateUser = function(password,signature,lang,email_mytopics,email_followedtopics,email_mychannels,email_followedchannels,data,suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{
				if (json.update_user.ok)
					Engine.updateUserSession(false);
				suc({ok:json.update_user.ok, error:json.update_user.error}, data);
			};
		})(data, suc);

		jQuery.ajax({
			url:'engine.php?what=update_user',
			dataType:'json',
			type:'GET',
			data:{'password_update_user':password,'lang_update_user':lang,'signature_update_user':signature, 'email_mytopics_update_user':email_mytopics, 'email_followedtopics_update_user':email_followedtopics, 'email_mychannels_update_user':email_mychannels, 'email_followedchannels_update_user':email_followedchannels},
			success:closure,
			error:function()
			{
				console.log('error on controller.Mailman.updateUser');
			}
		});
	};
	this.getRegUserEMail = function(email)
	{
		var response = jQuery.parseJSON( jQuery.ajax({
			url:'engine.php?what=reguser&email_reguser='+email,
			dataType:'json',
			async:false,
			error:function()
			{
				console.log('error on controller.Mailman.getRegUserEMail');
			}
		}).responseText );
		return response.reguser;
	}
	this.getRegUserNickname = function(nickname)
	{
		var response = jQuery.parseJSON( jQuery.ajax({
			url:'engine.php?what=reguser',
			dataType:'json',
			type:'GET',
			data:{'nickname_reguser':nickname},
			async:false,
			error:function()
			{
				console.log('error on controller.Mailman.getRegUserNickname');
			}
		}).responseText );
		return response.reguser;
	}
	this.getMyChannels = function()
	{
		var response = jQuery.parseJSON( jQuery.ajax({
			url:'engine.php?what=mychannels',
			dataType:'json',
			async:false,
			error:function()
			{
				console.log('error on controller.Mailman.getMyChannels');
			}
		}).responseText );
		return this.processResponse(response).mychannels;
	}
	this.updateLogo = function(filename, cid, x1, x2, y1, y2, data, suc)
	{
		var closure = (function(data, suc)
		{
			return function(json)
			{
				suc({error:json.update_channel_logo.error,ok:json.update_channel_logo.ok}, data);
			};
		})(data, suc);

		jQuery.ajax(
		{
			url:'engine.php?what=update_channel_logo&channelid_update_channel_logo='+cid,
			dataType:'JSON',
			type:'GET',
			data:{'x1':x1,'x2':x2,'y1':y1,'y2':y2,'file':filename},
			success:closure,
			error:function()
			{
				console.log('error on controller.Mailman.updateLogo');
			}
		});
	};
	this.updateAvatar = function(filename, cid, x1, x2, y1, y2, data, callback)
	{
		jQuery.getJSON('engine.php?what=update_user_avatar&userid_update_user_avatar='+cid+
			'&x1='+x1+'&x2='+x2+'&y1='+y1+'&y2='+y2+'&file='+filename,function(json)
		{
			data.error = json.update_user_avatar.error;
			data.ok = json.update_user_avatar.ok;
			callback(data);
		}).error(function()
		{
			console.log('error on controller.Mailman.updateAvatar');
		});
	}
	this.uploadTmpLogo = function(fileid, data, callback)
	{
		jQuery.ajaxFileUpload({
			url:'engine.php?what=upload_temp_logo',
			secureuri:false,
			fileElementId:fileid,
			dataType:'json',
			success: function(json)
			{
				data.filename = json.upload_temp_logo.filename;
				data.error = json.upload_temp_logo.error;
				data.ok = json.upload_temp_logo.ok;
				callback(data);
			},
			error:function()
			{
				console.log('error on controller.Mailman.uploadTmpLogo');
			}
		});
	}
	this.uploadTmpAvatar = function(fileid, data, callback)
	{
		jQuery.ajaxFileUpload({
			url:'engine.php?what=upload_temp_avatar',
			secureuri:false,
			fileElementId:fileid,
			dataType:'json',
			success: function(json)
			{
				data.filename = json.upload_temp_avatar.filename;
				data.error = json.upload_temp_avatar.error;
				data.ok = json.upload_temp_avatar.ok;
				callback(data);
			},
			error:function()
			{
				console.log('error on controller.Mailman.uploadTmpAvatar');
			}
		});
	}
	this.getRecentTopicsFromSignedChannels = function(lastorderid, ntopics, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).followedchanneltopics, data);
			};
		})(this, data, suc);
		var url = 'engine.php?what=followedchanneltopics&lastorderid_followedchanneltopics='+lastorderid+
				'&qtd_followedchanneltopics='+ntopics;

		jQuery.getJSON(url, closure).error(function()
		{
			console.log('error on controller.Mailman.getRecentTopicsFromSignedChannels');
		});
	}
	this.getOldTopicsFromSignedChannels = function(firstorderid, ntopics, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).followedchanneltopics, data);
			};
		})(this, data, suc);
		var url = 'engine.php?what=followedchanneltopics&orderid_followedchanneltopics='+firstorderid+
				'&qtd_followedchanneltopics='+ntopics;

		jQuery.getJSON(url, closure).error(function()
		{
			console.log('error on controller.Mailman.getOldTopicsFromSignedChannels');
		});
	}
	this.getRecentTopicsFromChannel = function(channelid, lastorderid, ntopics, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).new_topic_previews, data);
			};
		})(this, data, suc);
		
		var url = '../engine.php?what=new_topic_previews&idchannel_new_topic_previews='+channelid+'&orderid_new_topic_previews='+lastorderid+
				'&qtd_new_topic_previews='+ntopics;

		jQuery.getJSON(url, closure).error(function()
		{
			console.log('error on controller.Mailman.getRecentTopicsFromChannel');
		});
	};
	this.getOldTopicsFromChannel = function(channelid,firstorderid,ntopics)
	{
		var response = jQuery.parseJSON( jQuery.ajax({
			url:'../engine.php?what=recenttopics&idchannel_recenttopics='+channelid+'&orderid_recenttopics='+firstorderid+
				'&qtd_recenttopics='+ntopics,
			dataType:'json',
			async:false,
			error:function()
			{
				console.log('error on controller.Mailman.getOldTopicsFromChannel');
			}
		}).responseText );
		return this.processResponse(response).recenttopics;
	};
	this.getNewUFT = function(idchannel, lastorderid, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).uft, data);
			};
		})(this, data, suc);

		jQuery.ajax(
		{
			url:'engine.php?what=uft',
			dataType:'JSON',
			type:'GET',
			data:{'idchannel_uft':idchannel,'lastorderid_uft':lastorderid},
			success:closure,
			error:function()
			{
				console.log('error on controller.Mailman.getNewFollowedChannelTopics');
			}
		});
	};
	this.visitTopic = function(topicid)
	{
		urltosend='../engine.php?what=visittopic&topicid_visittopic='+topicid;
		var response = jQuery.parseJSON( jQuery.ajax({
			url:urltosend,
			dataType:'json',
			async:false,
			type:'GET',
			error:function()
			{
				console.log('error on controller.Mailman.visitTopic');
			}
		}).responseText );
		return {ok:response.visittopic.ok, error:response.visittopic.error};
	};
	this.resetPassword = function(email, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc({ok:json.request_restore_password.ok, error:json.request_restore_password.error}, data);
			};
		})(this, data, suc);

		var url = 'engine.php?what=request_restore_password&user_request_restore_password='+email;
		jQuery.getJSON(url, closure).error(function()
		{
			console.log('error on controller.Mailman.resetPassword');
		});
	};
	this.getLANG = function()
	{
		var urltosend='../engine.php?what=lang';
		var response = jQuery.parseJSON( jQuery.ajax({
			url:urltosend,
			dataType:'json',
			async:false,
			type:'GET',
			error:function()
			{
				console.log('error on controller.Mailman.getLANG');
			}
		}).responseText );
		return this.processResponse(response).lang;
	};
	this.getRecentUsers = function(n, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).userscamefrom, data);
			};
		})(this, data, suc);
		
		var urltosend='engine.php?what=userscamefrom&qtd_userscamefrom='+n+
			'&camefrom_userscamefrom=-1';

		jQuery.ajax(
		{
			url:urltosend,
			dataType:'JSON',
			type:'GET',
			success:closure,
			error:function()
			{
				console.log('error on controller.Mailman.getRecentUsers');
			}
		});
	};
	this.setUserFrom = function(nick, pass, fromid)
	{
		jQuery.ajax(
		{
			url:'engine.php?what=setuserfrom',
			dataType:'JSON',
			type:'GET',
			data:{'nick_setuserfrom':nick,'pass_setuserfrom':pass,'fromid_setuserfrom':fromid},
			error:function()
			{
				console.log('error on controller.Mailman.setUserFrom');
			}
		});
	};
	this.getUser = function(userid, data, suc)
	{
		var closure = (function(thi, data, suc)
		{
			return function(json)
			{
				suc(thi.processResponse(json).user, data);
			};
		})(this, data, suc);

		jQuery.ajax(
		{
			url:"engine.php?what=user&id_user="+userid+"&anon_user=0",
			dataType:'JSON',
			type:'GET',
			success:closure,
			error:function()
			{
				console.log('error on controller.Mailman.getUser');
			}
		});
	};
};

var OfferChannels = Class.extend({

	init: function()
	{
		this.view = new OfferChannelsSection(this);
	},
	finalizeInit: function()
	{
		Mailman.getRecommendedChannelPreviews(9, {thi:this}, function(channels, data)
		{
			data.thi.setChannels(channels.reverse());
		});
	},
	setChannels: function(channels)
	{
		var n = Math.min(channels.length, 9);
		this.channels = channels.splice(0, n);
		this.subs = new Array(n);
		for (var i = 0; i < n; i++)
		{
			this.subs[i] = true;
			this.view.prependChannel(this.channels[i]);
		}
	},
	subscribe: function(cid, yes)
	{
		for (var i = 0; i < this.channels.length; i++)
		{
			if (this.channels[i].get('id')==cid)
			{
				this.subs[i] = yes;
				break;
			}
		}
	},
	subscribeAndContinue: function()
	{
		this.view.setLoading();
		var ids = new Array();
		for (var i = 0; i < this.channels.length; i++)
			if (this.subs[i])
				ids.push(this.channels[i].get('id'));
		Mailman.subscribeChannels(ids, {thi:this}, function(r, data)
		{
			Engine.rebuildMain();
			Engine.onlineUpdateThenUpdate();
			data.thi.view.unsetLoading();
			Engine.destroyOfferChannels();
			var noerrors=true;
			for (var i=0;i<r.length;i++){
				if (!r[i].ok){
					new SimpleNotice('Alerta', beautify_error(r[i].error));
					noerrors=false;
					break;
				}
			}
		});
	},
	cancelAndContinue: function()
	{
		Engine.destroyOfferChannels();
	},
	destroy: function()
	{
		this.view.destroy();
	}
});

var LikeDislike = Class.extend({

	init:function(element, topicorpost)
	{
		this.topicorpost = topicorpost;
		this.element = element;
		this.view = new LikeDislikeView(element, topicorpost);
	},
	setLikes:function(n)
	{
		this.view.setLikes(n);
	},
	setDislikes:function(n)
	{
		this.view.setDislikes(n);
	},
	update:function()
	{
		this.view.update();
	}
});

var PublicUserPage = Class.extend({

	init:function(userid, tab)
	{
		this.tab = tab;
		Mailman.getUser(userid, {thi:this}, function(user, data)
		{
			data.thi.user = user;
			data.thi.finalizeInit();
		});
	},
	finalizeInit:function()
	{
		this.view = new PublicUserPageView(this.user);
		this.tab.setTitle('!'+this.user.get('nickname'));
		this.tab.setContent( this.view.getElement() );
		this.tab.onBeforeClose({thi:this}, function(data)
		{
			data.thi.destroy();
		});
	},
	update:function()
	{
		this.view.update();
	},
	onlineUpdate:function()
	{

	},
	select:function(real)
	{
		this.tab.select(real);
	},
	destroy:function()
	{
		this.view.destroy();
	}
});

setInterval('Engine.onlineUpdateThenUpdate();',15000);
