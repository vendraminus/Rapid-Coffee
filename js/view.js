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
var ThePage = Class.extend({

	init: function()
	{
		this.head = jQuery('head');
		this.body = jQuery('body');
	},
	initBigButtons: function()
	{
		this.body.find('div.big-btn').unbind('mouseover').mouseover(function()
		{
			jQuery(this).addClass('big-btn-active');
			jQuery(this).find('div.text').addClass('text-active');
			jQuery(this).find('div.btn-right').addClass('btn-right-active');
		});
		this.body.find('div.big-btn').unbind('mouseout').mouseout(function()
		{
			jQuery(this).removeClass('big-btn-active');
			jQuery(this).find('div.text').removeClass('text-active');
			jQuery(this).find('div.btn-right').removeClass('btn-right-active');
		});
	},
	getBody: function()
	{
		return this.body;
	}
});

var MainPage = Class.extend({

	init: function()
	{
		this.element = jQuery('#maintab-cont-0');
		this.leftcol = this.element.find('#main-left-col');
		this.rightcol = this.element.find('#main-right-col');
	},
	destroy: function()
	{
		this.element.find('#main-left-col').html('');
		this.element.find('#main-right-col').html('');
	},
	setLeftCol:function(uft, recenttopics)
	{
		this.leftcol.append(uft).append(recenttopics);
	},
	appendInRightCol:function(element)
	{
		this.rightcol.append(element);
	},
	update:function()
	{
	}
});

var ChannelsListPage = Class.extend({

	init: function(controller)
	{
		this.controller = controller;
		this.element = Mailman.getTemplate('channels-list');
	},
	appendChannel:function(channel)
	{
		this.element.find('.channel-previews').append(channel);
	},
	prependChannel:function(channel)
	{
		this.element.find('.channel-previews').prepend(channel);
	},
	getElement: function()
	{
		return this.element;
	},
	clearPreviews:function()
	{
		this.element.find('.channel-previews').html('');
	},
	setBottomMessage: function(msg, click)
	{

	}
});

var SearchChannelsListPage = ChannelsListPage.extend({

	init: function(controller)
	{
		this._super(controller);
		this.update();
		var search = this.element.find('.search-box input.search');
		search.enter({thi:this},function(event)
		{
			var words = event.data.thi.element.find('.search-box input.search').val();
			event.data.thi.controller.search(words);
		});
		this.element.find('.list-all span').click({thi:this},function(event)
		{
			event.data.thi.controller.search('');
		});
		activate_input_placeholder(search);
		this.element.find('.load-icon-big').css('visibility','visible');
	},
	update: function()
	{
		this.element.find('.channels-list .title').html(Engine.lang.lines_searchchannels);
	},
	channelFound: function(b)
	{
		if (b)
			this.element.find('.no-channel-found').hide();
		else
			this.element.find('.no-channel-found').show();
	},
	setLoading: function()
	{
		this.element.find('.load-icon-big').css('display','block');
	},
	unsetLoading: function()
	{
		this.element.find('.load-icon-big').css('display','none');
	}
});


var SuggestChannelsListInMainPage = Class.extend({

	init: function(controller)
	{
		this.controller = controller;
		this.element = Mailman.getTemplate('channels-main-suggest');
		this.element.find('.footnote a.seeall').click(function()
		{
			History.appendSearchChannelsListTab('[suggestchannels]');
			return false;
		});
		this.update();
	},
	appendChannel:function(channel)
	{
		this.element.find('.channels-suggest').append(channel);
	},
	prependChannel:function(channel)
	{
		this.element.find('.channels-suggest').prepend(channel);
	},
	getElement: function()
	{
		return this.element;
	},
	update: function()
	{
		this.element.find('.title').html('canais que podem lhe interessar');
		this.element.find('.seeall').html('sugira mais');
	}
});

var SignedChannelsListInMainPage = Class.extend({

	init: function(controller)
	{
		this.controller = controller;
		this.element = Mailman.getTemplate('channels-main-signed');
		this.element.find('.footnote a.seeall').click(function()
		{
			if (Engine.getMyUserSession().anon)
				History.appendSearchChannelsListTab('');
			else
				History.appendSearchChannelsListTab('[signedchannels]');
			return false;
		});
		this.update();
	},
	appendChannel:function(channel)
	{
		this.element.find('.channel-previews').append(channel);
	},
	prependChannel:function(channel)
	{
		this.element.find('.channel-previews').prepend(channel);
	},
	getElement: function()
	{
		return this.element;
	},
	update: function(){
		if (Engine.user.anon)
		{
			this.element.find('.title').html(Engine.lang.lines_offeredchannels);
			this.element.find('.seeall').html(Engine.lang.link_seeall);
		} else {
			this.element.find('.title').html(Engine.lang.lines_signedchannels);
			this.element.find('.seeall').html(Engine.lang.link_seeallsigned);
		}
	}

});



var ChannelPreview = Class.extend({


	init: function(channel, controller)
	{
		this.channel = channel;
		this.controller = controller;
		this.element = Mailman.getTemplate('channel-preview');
		this.element.addClass('cid-'+channel.id);
		this.element.find('.name').html('#'+channel.get('name')).click({cid:channel.id},function(event)
		{
			History.appendChannelTab(event.data.cid);
		});
		this.element.find('.logo-med').click({cid:channel.id},function(event){ History.appendChannelTab(event.data.cid) });
		this.update();
	},
	update: function()
	{
		this.element.find('.description').html(this.channel.description);
		this.element.find('.logo-med').attr('src',this.channel.logo('med'));

		var sub = this.element.find('.subscription');
		sub.find('input').hide();

		this.element.find('.moderator').html(this.channel.author);
		this.element.find('.creation-time').html(this.channel.date);

		var me = Engine.getMyUserSession();
		if (me.anon)
			return;
		if (me.amIAuthorThisChannel(this.channel))
		{
			var button = sub.find('.button-green');
			button.show();
			button.attr('value',Engine.lang.button_panelchannel);
			button.unbind().click({channel:this.channel}, function(event)
			{
				History.appendChannelAdmin(event.data.channel.get('id'));
			});

		} else {
			if (me.amISubscriberThisChannel(this.channel))
			{
				var button = sub.find('.button-bad');
				button.show();
				button.attr('value',Engine.lang.button_cancelsignchannel);
				button.unbind().click({thi:this}, function(event)
				{ 
					event.data.thi.setLoading();
					event.data.thi.channel.unsubscribe({thi:event.data.thi}, function(ok, data)
					{
						if (ok)
						{
							new FastNotice(Engine.lang.msg_unsubscribedchannel+ data.thi.channel.get('name') +'".');
							Engine.rebuildMain();
							Engine.update();
						}
						data.thi.unsetLoading();
					});
				});
			} else {
				var button = sub.find('.button-good');
				button.show();
				button.attr('value',Engine.lang.button_signchannel);
				button.unbind().click({thi:this}, function(event)
				{
					event.data.thi.setLoading();
					event.data.thi.channel.subscribe({thi:event.data.thi}, function(ok, data)
					{
						if (ok)
						{
							new FastNotice(Engine.lang.msg_subscribedchannel+data.thi.channel.get('name') +'".');
							Engine.rebuildMain();
							Engine.update();
						}
						data.thi.unsetLoading();
					});
				});
			}
		}
	},
	getElement: function()
	{
		return this.element;
	},
	remove: function(){
		this.element.remove();
	},
	setLoading: function()
	{
		this.element.find('.load-icon-small').css('visibility','visible');
	},
	unsetLoading: function()
	{
		this.element.find('.load-icon-small').css('visibility','hidden');
	}
});

var ChannelLittlePreviewInMain = Class.extend({


	init: function(channel, controller)
	{
		this.channel = channel;
		this.controller = controller;
		this.element = Mailman.getTemplate('channel-main-little-preview');
		this.element.addClass('cid-'+channel.id);
		this.element.find('.logo-med').click({cid:channel.id},function(event){ History.appendChannelTab(event.data.cid) });
		this.element.find('.logo-med').mouseenter(function()
		{
			jQuery(this).parent().parent().parent().find('.mouseover-hint-minipreview').show();
		});
		this.element.find('.logo-med').mouseleave(function()
		{
			jQuery(this).parent().parent().parent().find('.mouseover-hint-minipreview').hide();
		});
		this.update();
		this.element.find('.mouseover-hint-minipreview').html('#'+channel.name);
	},
	update: function()
	{
		this.element.find('.logo-med').attr('src',this.channel.logo('med'));
	},
	getElement: function()
	{
		return this.element;
	},
	remove: function(){
		this.element.remove();
	}
});

var ChannelSuggestInMain = Class.extend({

	init: function(channel, controller)
	{
		this.channel = channel;
		this.controller = controller;
		this.element = Mailman.getTemplate('channel-main-suggest');
		this.element.addClass('cid-'+channel.id);
		this.element.find('.name').html('#'+channel.get('name')).click({cid:channel.id},function(event)
		{
			History.appendChannelTab(event.data.cid);
			return false;
		});
		this.element.find('.desc').html(channel.get('description'));
		//this.element.find('.desc').html("O barcenalona desta jogando contra o machneste united. Eh o primeiro jogo deneo os dois que acontecel ainda. Visistem entao.");
		this.element.find('.logo-med').click({cid:channel.id},function(event){ History.appendChannelTab(event.data.cid); });
		this.update();
	},
	update: function()
	{
		this.element.find('.logo-med').attr('src',this.channel.logo('med'));
	},
	getElement: function()
	{
		return this.element;
	},
	remove: function(){
		this.element.remove();
	}
});

var ChannelPreviewInMain = Class.extend({


	init: function(channel, controller)
	{
		this.channel = channel;
		this.controller = controller;
		this.element = Mailman.getTemplate('channel-main-preview');
		this.element.addClass('cid-'+channel.id);
		/*
		this.element.find('.name').html(channel.name).click({cid:channel.id},function(event)
		{
			History.appendChannelTab(event.data.cid);
		});
		*/
		this.element.find('.logo-med').click({cid:channel.id},function(event){ History.appendChannelTab(event.data.cid) });
		this.update();
	},
	update: function()
	{
		this.element.find('.logo-med').attr('src',this.channel.logo('med'));
	},
	getElement: function()
	{
		return this.element;
	},
	remove: function(){
		this.element.remove();
	}
});


var ChannelPage = Class.extend({

	init: function(controller, channel, create_topic)
	{
		this.controller = controller;
		this.channel = channel;
		this.create_topic = create_topic;
		this.create_topic.setWidth(280);
		this.element = Mailman.getTemplate('channel');
		this.leftcol = this.element.find('.left-col');
		this.rightcol = this.element.find('.right-col');
		this.head = this.element.find('.channel-head');
		this.head.find('.left .channel-title').html(this.channel.get('name'));
		var user = Engine.getMyUserSession();
		this.user = user;
		if (!user.get('anon'))
		{
			if (user.amIAuthorThisChannel(channel))
				this.setPainelButton();
			else if (user.amISubscriberThisChannel(channel))
				this.setUnsubscribeButton();
			else
				this.setSubscribeButton();
		} else {
			this.unsetSubscriptionButtons();
		}
		if (Engine.isTourRunning())
			this.channeltip = new ChannelTip(this.element, channel);

		if (!channel.canICreateTopic())
		{
			this.rightcol.find('a.expand').hide();
			this.head.find('li.ctopic').html('não posso criar tópico');
		}
		if (!channel.canIPost())
			this.head.find('li.atopic').html('não posso responder tópico');
	},
	finalizeInit:function()
	{
		this.element.find('a.expand').click({thi:this},function(event)
		{
			event.data.thi.expandCreateTopic();
			return false;
		});
		this.element.find('a.unexpand').click({thi:this},function(event)
		{
			event.data.thi.unexpandCreateTopic();
			return false;
		});
	},
	update:function()
	{
		if (Engine.isTourRunning())
		{
			if (!this.channeltip)
				this.channeltip = new ChannelTip(this.element, this.channel);
		} else {
			if (this.channeltip)
			{
				this.channeltip.destroy();
				this.channeltip = null;
			}
		}
	},
	setSubscriptionLoading:function()
	{
		this.head.find('.right .load-icon-small').css('visibility','visible');
	},
	unsetSubscriptionLoading:function()
	{
		this.head.find('.right .load-icon-small').css('visibility','hidden');
	},
	unsetSubscriptionButtons:function()
	{
		this.head.find('.right input').unbind().css('display','none');
	},
	setSubscribeButton:function()
	{
		this.unsetSubscriptionButtons();
		var b = this.head.find('.right input.button-good');
		b.css('display','inline-block');
		b.click({thi:this}, function(event)
		{
			event.data.thi.controller.subscribe();
		});
	},
	setUnsubscribeButton:function()
	{
		this.unsetSubscriptionButtons();
		var b = this.head.find('.right input.button-bad');
		b.css('display','inline-block');
		b.click({thi:this}, function(event)
		{
			event.data.thi.controller.unsubscribe();
		});
	},
	setPainelButton:function()
	{
		this.unsetSubscriptionButtons();
		var b = this.head.find('.right input.button-green');
		b.css('display','inline-block');
		b.click({thi:this}, function(event)
		{
			event.data.thi.controller.adminPanel();
		});
	},
	setLeftCol:function(uft, recenttopics)
	{
		this.leftcol.append(uft).append(recenttopics);
	},
	setRightCol:function(ctopic_section)
	{
		this.rightcol.append(ctopic_section);
	},
	expandCreateTopic:function()
	{
		this.leftcol.hide();
		this.rightcol.addClass('expand-create-topic');
		this.prevcreatetopicwidth = this.create_topic.getWidth();
		this.prevcreatetopicheight = this.create_topic.getHeight();
		this.create_topic.setWidth(CONF['width_topic_expand']);
		this.create_topic.setHeight(CONF['height_topic_expand']);
		this.element.find('a.unexpand').show();
		this.element.find('a.expand').hide();
		this.create_topic.showAdvancedButtons();
	},
	unexpandCreateTopic:function()
	{
		if (this.rightcol.hasClass('expand-create-topic'))
		{
			this.rightcol.removeClass('expand-create-topic');
			this.create_topic.setWidth(this.prevcreatetopicwidth);
			this.create_topic.setHeight(this.prevcreatetopicheight);
			this.leftcol.show();
			this.element.find('a.unexpand').hide();
			this.element.find('a.expand').show();
			this.create_topic.hideAdvancedButtons();
		}
	},
	getElement: function()
	{
		return this.element;
	},
	destroy: function()
	{
		this.create_topic.destroy();
	}
});


var TinyMCE = Class.extend({

	init: function(config, idname, initadvancedbuttons)
	{
		this.cursorin = false;
		this.enabled = true;
		this.idname = idname;
		this.initadvancedbuttons = initadvancedbuttons;

		var configs = [{
			// General options
			mode : "exact",
			elements : idname,
			theme : "advanced",
			plugins : "autolink,lists,spellchecker,pagebreak,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
			
			// Theme options
			theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
			theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,code,|,forecolor,backcolor",
			theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_resizing : true,
			theme_advanced_resize_horizontal : false,
			
			// Skin options
			skin : "o2k7",
			skin_variant : "silver",
			
			// Example content CSS (should be your site CSS)
			content_css : "/css/tinymce.css",
			
			// Drop lists for link/image/media/template dialogs
			//template_external_list_url : "js/template_list.js",
			//external_link_list_url : "js/link_list.js",
			external_image_list_url : "/js/image_list.js",
			//media_external_list_url : "js/media_list.js",
			
			// Replace values for the template plugin
			template_replace_values : {
			        username : "Rapid Coffee",
			        staffid : "999"
			},
			convert_urls : false,
			paste_preprocess : function(pl, o)
			{
				o.content = add_anchor_tag(o.content);
			},
			paste_postprocess : function(pl, o)
			{
				var t = jQuery(o.node);
				t.find('a').each(function(index,obj)
				{
					obj = jQuery(obj);
					obj.attr('target','_blank');
				});
				o.node = t.get(0);
			}
		}];

//		var configs = [{
//		        mode : "exact",
//			plugins : 'paste',
//			elements : idname,
//			theme : 'advanced_rc',
//			theme_advanced_rc_buttons1 : 'bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist',
//			theme_advanced_rc_buttons2 : 'cut,copy,paste,code,|,undo,redo,|,image,link,unlink,blockquote',
//			theme_advanced_rc_buttons3 : '',
//			convert_urls : false,
//			paste_preprocess : function(pl, o)
//			{
//				o.content = add_anchor_tag(o.content);
//			},
//			paste_postprocess : function(pl, o)
//			{
//				var t = jQuery(o.node);
//				t.find('a').each(function(index,obj)
//				{
//					obj = jQuery(obj);
//					obj.attr('target','_blank');
//				});
//				o.node = t.get(0);
//			}
//			
//		}];

		this.config = configs[config];

		this.setSetup();
	},
	setSetup: function()
	{
		var setup = function(ed)
		{
			if (this.initialcontent)
			{
				var c = (function(msg, ed)
				{
					return function()
					{
						ed.setContent(msg);
					};
				})(this.initialcontent, ed);
				ed.onInit.add(c);
			}
			if (this.enabled)
				TinyMCEReadOnlySetup(ed, false);
			else
				TinyMCEReadOnlySetup(ed, true);

			if (this.autoscroll)
			{
				var c = (function(thi)
				{
					return function()
					{
						thi.scroll();
					};
				})(this);
				ed.onInit.add(c);
			}
			ed.onInit.add(jQuery.proxy(function()
			{
				var closure = (function(thi)
				{
					return function(event)
					{
						thi.onClickIn(event);
					};
				})(this);
				var ibody = document.getElementById(this.idname+"_ifr").contentWindow.document.body;
				jQuery(ibody).click(closure);
				jQuery('#'+this.idname+"_parent").click(closure);

				jQuery('#'+this.idname).parent().find('span.tinymce-holder').addClass('tinymce-holder-'+this.idname);

				this.bodyclickclosure = (function(thi)
				{
					return function(event)
					{
						var father = jQuery('#'+thi.idname+'_toolbargroup').parent().parent();
						if (father.find(event.target).length>0||jQuery(event.target).hasClass('tinymce-holder-'+thi.idname))
							thi.onClickIn(event);
						else
							thi.onClickOut(event);
						return true;
					};
				})(this);
				jQuery('body').click(this.bodyclickclosure);
				var callback = function(event)
				{
					if (!event.data.thi.cursorin)
					{
						event.data.thi.cursorin = true;
						event.data.thi.cursorEntered();
					}
				};
				jQuery(document.getElementById(this.idname+"_ifr").contentWindow.document).keydown({thi:this},callback);

				if (!this.initadvancedbuttons)
					this.hideAdvancedButtons();
				console.log(jQuery('#'+ this.idname+'_tbl > tbody > tr.mceFirst'));
				jQuery('#'+ this.idname+'_tbl > tbody > tr.mceFirst').css('display','table-row');
			}, this));
		};
		this.config.setup = jQuery.proxy(setup, this);
	},
	setCursorEnteredCallback:function(callback)
	{
		this.cursorenteredcallback = callback;
	},
	setCursorLeavedCallback:function(callback)
	{
		this.cursorleavedcallback = callback;
	},
	cursorEntered:function()
	{
		if (this.cursorenteredcallback)
			this.cursorenteredcallback();
	},
	cursorLeaved:function()
	{
		if (this.cursorleavedcallback)
			this.cursorleavedcallback();
	},
	scroll: function()
	{
		jQuery.scrollTo(jQuery('#'+this.idname+'_parent'),{duration:500,offset:-100});
	},
	focus: function(forcefocus)
	{
		if (typeof forcefocus === 'undefined')
			forcefocus = true;
		if (!this.cursorin)
		{
			this.cursorin = true;
			this.cursorEntered();
		}
		if (forcefocus)
			tinyMCE.execCommand('mceFocus',false,this.idname);
	},
	blur: function()
	{
		if (this.onblurcallback)
			this.onblurcallback(this.onblurdata);
	},
	onClickIn:function()
	{
		if (!this.cursorin)
		{
			this.cursorin = true;
			this.focus();
			this.cursorEntered();
		}
	},
	onClickOut:function()
	{
		if (this.cursorin)
		{
			this.cursorin = false;
			this.cursorLeaved();
		}
	},
	onBlur: function(data, callback)
	{
		this.onblurdata = data;
		this.onblurcallback = callback;
		jQuery('body').click({thi:this}, function(event)
		{
			if (event.srcElement && event.srcElement.className=='topic-body-placeholder')
				return;
			if (event.target && jQuery(event.target).hasClass('topic-body-placeholder'))
				return;
			event.data.thi.blur();
		});
	},
	showAdvancedButtons:function()
	{
		var tbg = jQuery('#'+this.idname+'_toolbargroup');
		tbg.find('#'+this.idname+'_formatselect').parent().parent().show();
		tbg.find('#'+this.idname+'_fontselect').parent().parent().show();
		tbg.find('#'+this.idname+'_fontsizeselect').parent().parent().show();
		tbg.find('#'+this.idname+'_search').parent().show();
		tbg.find('#'+this.idname+'_replace').parent().show();
		tbg.find('#'+this.idname+'_replace').parent().next().show();
		tbg.find('#'+this.idname+'_outdent').parent().show();
		tbg.find('#'+this.idname+'_indent').parent().show();
		tbg.find('#'+this.idname+'_blockquote').parent().show();
		tbg.find('#'+this.idname+'_blockquote').parent().next().show();
		tbg.find('#'+this.idname+'_anchor').parent().show();
		tbg.find('#'+this.idname+'_image').parent().show();
		tbg.find('#'+this.idname+'_toolbar3').show();
		tbg.find('#'+this.idname+'_forecolor').parent().parent().show();
		tbg.find('#'+this.idname+'_backcolor').parent().parent().show();
		tbg.find('#'+this.idname+'_cleanup').parent().show();
		tbg.find('#'+this.idname+'_code').parent().show();
		tbg.find('#'+this.idname+'_code').parent().next().show();
	},
	hideAdvancedButtons:function()
	{
		var tbg = jQuery('#'+this.idname+'_toolbargroup');
		tbg.find('#'+this.idname+'_formatselect').parent().parent().hide();
		tbg.find('#'+this.idname+'_fontselect').parent().parent().hide();
		tbg.find('#'+this.idname+'_fontsizeselect').parent().parent().hide();
		tbg.find('#'+this.idname+'_search').parent().hide();
		tbg.find('#'+this.idname+'_replace').parent().hide();
		tbg.find('#'+this.idname+'_replace').parent().next().hide();
		tbg.find('#'+this.idname+'_outdent').parent().hide();
		tbg.find('#'+this.idname+'_indent').parent().hide();
		tbg.find('#'+this.idname+'_blockquote').parent().hide();
		tbg.find('#'+this.idname+'_blockquote').parent().next().hide();
		tbg.find('#'+this.idname+'_anchor').parent().hide();
		tbg.find('#'+this.idname+'_image').parent().hide();
		tbg.find('#'+this.idname+'_toolbar3').hide();
		tbg.find('#'+this.idname+'_forecolor').parent().parent().hide();
		tbg.find('#'+this.idname+'_backcolor').parent().parent().hide();
		tbg.find('#'+this.idname+'_cleanup').parent().hide();
		tbg.find('#'+this.idname+'_code').parent().hide();
		tbg.find('#'+this.idname+'_code').parent().next().hide();
	},
	setWidth: function(width)
	{
		if (!tinyMCE.get(this.idname))
			this.config.width = width;
		else
			jQuery('#'+this.idname+'_tbl').width(width);
	},
	getWidth: function()
	{
		return jQuery('#'+this.idname+'_tbl').css('width');
	},
	setHeight: function(height)
	{
		if (!tinyMCE.get(this.idname))
			this.config.height = height;
		else
		{
			jQuery('#'+this.idname+'_tbl').height(height);
			jQuery('#'+this.idname+'_ifr').height(height);
		}
	},
	getHeight: function()
	{
		return jQuery('#'+this.idname+'_ifr').css('height');
	},
	setAutoFocus: function(focus)
	{
		if (focus)
			this.config.auto_focus = this.idname;
		else
			this.config.auto_focus = null;
	},
	initEditor: function()
	{
		tinyMCE.init(this.config);
	},
	isInitialized: function()
	{
		if (tinyMCE.get(this.idname))
			return true;
		return false;
	},
	setOnInit:function(callback)
	{
		this.config['oninit'] = callback;
	},
	setAutoScroll:function()
	{
		this.autoscroll = true;
	},
	destroy: function()
	{
		if (this.bodyclickclosure)
			jQuery('body').unbind('click',this.bodyclickclosure);

		jQuery(document.getElementById(this.idname+"_ifr").contentWindow.document.body).unbind();
		jQuery('#'+this.idname+"_parent").unbind();
		if (this.isInitialized())
			tinyMCE.get(this.idname).remove();
	},
	getContent:function()
	{
		var t = jQuery('<span>'+tinyMCE.get(this.idname).getContent()+'</span>');
		t.find('a').each(function(index,obj)
		{
			jQuery(obj).attr('target','_blank');
		});
		t.find('iframe').each(function(index,obj)
		{
			var src = jQuery(obj).attr('src')
			if (/\?.+/.test(src))
				src = src + "&wmode=opaque";
			else if (/\?$/.test(src))
				src = src + "wmode=opaque";
			else
				src = src + "?wmode=opaque";
			jQuery(obj).attr('src',src);
			jQuery(obj).attr('allowtransparency','allowtransparency');
		});
		return t.html();
	},
	setContent:function(txt)
	{
		return tinyMCE.get(this.idname).setContent(txt);
	},
	setInitialContent:function(msg)
	{
		this.initialcontent = msg;
	},
	enable:function()
	{
		this.enabled = true;
		tinyMCE.get(this.idname).switchReadOnly(false);
	},
	disable:function()
	{
		this.enabled = false;
		if (this.isInitialized())
			tinyMCE.get(this.idname).switchReadOnly(true);
	}
});

var CreateTopicSection = Class.extend({

	init: function(controller, channel)
	{
		this.controller = controller;
		this.channel = channel;
		this.element = Mailman.getTemplate('create-topic');
		this.tinymce = new TinyMCE(0, 'add-topic-body-'+channel.id);
		this.tinymce.setWidth(CONF['width-small-create-topic']);
		this.tinymce.setHeight(CONF['height-small-create-topic']);
		var ititle = this.element.find('input.add-topic-title');
		ititle.keydown({thi:this}, function(event)
		{
			if (event.keyCode==9)//tab
			{
				jQuery(this).blur();
				event.data.thi.tinymce.focus();
				return false;
			}
			return true;
		});
		if (this.channel.canICreateTopic())
			activate_input_placeholder(ititle, false);
		else
		{
			this.element.find('.add-topic-title').parent().find('.holder').html('você não pode criar tópico neste canal').addClass('holder-alert');
			this.element.find('span.tinymce-holder').html('você não pode criar tópico neste canal').addClass('holder-alert');
		}
		this.element.find('textarea').attr('id','add-topic-body-'+channel.id);
		this.element.find('input.button-good').clickOrEnter({controller:controller},function(event)
		{
			controller.createTopic();
		});
		this.tinymce.setCursorEnteredCallback(jQuery.proxy(function()
		{
			if (this.channel.canICreateTopic())
			{
				if (Engine.getMyUserSession().get('anon'))
					new FastNotice('Lembre-se que você não está logado.');
				this.bodyFocus();
			}
		}, this));
		this.tinymce.setCursorLeavedCallback(jQuery.proxy(function()
		{
			if (this.channel.canICreateTopic())
				this.bodyBlur();
		}, this));
		this.element.find('span.tinymce-holder').click({thi:this}, function(event)
		{
			if (event.data.thi.channel.canICreateTopic())
			{
				event.data.thi.tinymce.focus();
				event.data.thi.bodyFocus();
			}
		});
		this.update();
	},
	showAdvancedButtons:function()
	{
		this.tinymce.showAdvancedButtons();
	},
	hideAdvancedButtons:function()
	{
		this.tinymce.hideAdvancedButtons();
	},
	setCannotCreateTopic: function()
	{
		this.element.find('input.add-topic-title').prop('disabled',true);
		this.tinymce.disable();
		this.element.find('input.button-good').prop('disabled',true);
		this.element.find('input.button-bad').prop('disabled',true);
		this.element.find('a.expand').unbind().click(function(){return false;});
		this.element.find('a.unexpand').unbind().click(function(){return false;});
	},
	update: function()
	{
		this.element.find('.createyourtopic').html(Engine.lang.lines_createyourtopic);
		this.element.find('.expand').html(Engine.lang.link_expand);
		this.element.find('.unexpand').html(Engine.lang.link_unexpand);
		this.element.find('.button-good').val(Engine.lang.button_createtopic_newtopic);
	},
	bodyFocus: function()
	{
		this.element.find('span.tinymce-holder').hide();
	},
	bodyBlur: function()
	{
		if (this.tinymce.getContent().length==0)
			this.element.find('span.tinymce-holder').show();
	},
	getElement: function()
	{
		return this.element;
	},
	setElement: function(e)
	{
		this.element = e;
	},
	initTinyMCE: function()
	{
		this.tinymce.initEditor();
	},
	destroy: function()
	{
		this.tinymce.destroy();
	},
	setWidth: function(width)
	{
		this.tinymce.setWidth(width+'px');
		this.element.find('input.add-topic-title').width((width-10)+'px');
	},
	getWidth: function()
	{
		return parseInt(this.tinymce.getWidth());
	},
	setHeight: function(height)
	{
		this.tinymce.setHeight(height+'px');
	},
	getHeight: function()
	{
		return parseInt(this.tinymce.getHeight());
	},
	getSubject: function()
	{
		return this.element.find('input.add-topic-title').val();
	},
	getMsgBody: function()
	{
		return this.tinymce.getContent();
	},
	disable: function()
	{
		this.element.find('input.add-topic-title').attr('disabled','disabled');
		this.element.find('input.button-good').attr('disabled','disabled');
		this.tinymce.disable();
	},
	enable: function()
	{
		this.element.find('input.add-topic-title').removeAttr('disabled');
		this.element.find('input.button-good').removeAttr('disabled');
		this.tinymce.enable();
	},
	clear: function()
	{
		this.tinymce.setContent('');
		this.element.find('input.add-topic-title').val('');
		this.tinymce.blur();
		this.element.find('input.add-topic-title').blur();
		this.element.find('span.tinymce-holder').show();
	},
	setLoading:function(b)
	{
		if (b)
			this.element.find('.load-icon-small').css('visibility','visible');
		else
			this.element.find('.load-icon-small').css('visibility','hidden');
	},
	setExpandCallback: function(cb)
	{
		this.expandcallback = cb;
	},
	setUnexpandCallback: function(cb)
	{
		this.unexpandcallback = cb;
	}
});



/********** TOPIC PREVIEW SECTION **********/
var TopicPreviewsSection = Class.extend({

	init: function()
	{
	},
	getElement: function()
	{
		return this.element;
	},
	appendTopic: function(item)
	{

		if (this.animation)
		{
			item.hide();
			this.animation.push('slideDown',item);
		}
		this.element.find('.topic-previews').append( item );
	},
	prependTopic: function(item)
	{

		if (this.animation)
		{
			item.hide();
			this.animation.push('slideDown',item);
		}
		this.element.find('.topic-previews').prepend( item );
	},
	removeTopic: function(topic)
	{

	},
	prepareAnimation:function()
	{
		this.animation = new Animation();
	},
	startAnimation:function()
	{
		this.animation.start();
		this.animation = null;
	},
	destroy: function()
	{
		this.element.find('.topic-previews').html('');
	},
	destroyMore:function()
	{
		this.element.find('.more').remove();
	},
	showMore:function()
	{
		setTimeout(jQuery.proxy(function()
		{
			this.element.find('.more span').css('visibility','visible');
		}, this), 2500);
	},
	setShowMoreWait:function()
	{
		this.element.find('.more .wait-more').css('visibility','visible');
		this.element.find('.more span').css('visibility','hidden');
		//this.element.find('.more span').addClass('transparent');
	},
	unsetShowMoreWait:function()
	{
		this.element.find('.more .wait-more').css('visibility','hidden');
		this.element.find('.more span').css('visibility','visible');
	}
});

var RecentTopicsSection = TopicPreviewsSection.extend(
{
	init:function( controller)
	{
		this._super();
		this.controller = controller;
		this.element = Mailman.getTemplate('recent-topics');
		this.nomoreoldtopics = false;
		this.update();
		this.element.find('.more span').click({controller:controller},function(event)
		{
			event.data.controller.showMore();
			return false;
		});
	},
	update: function()
	{
		this.element.find('.head').find('.title').html(Engine.lang.lines_recenttopics);
		this.element.find('.more span').html(Engine.lang.button_more);
		if (!this.nomoreoldtopics && this.element.find('li.topic-preview').length >= CONF['number_recent_topics'])
			this.showMore();
	},
});

var UFTSection = TopicPreviewsSection.extend(
{
	init:function( controller)
	{
		this._super();
		this.controller = controller;
		this.element = Mailman.getTemplate('uft');
		this.update();
	},
	update: function(){
		this.element.find('.head').find('.title').html(Engine.lang.lines_uft);
	}
});

var RecentTopicsInMainSection = RecentTopicsSection.extend(
{
	init:function( controller)
	{
		this._super(controller);
	},
	update:function()
	{
		this._super();
	}
});


var RecentTopicsInChannelSection = RecentTopicsSection.extend(
{
	init:function( controller)
	{
		this._super(controller);
	},
	update:function()
	{
		this._super();
	}
});


var UFTInMainSection = UFTSection.extend(
{
	init:function( controller)
	{
		this._super(controller);
	}
});


var UFTInChannelSection = UFTSection.extend(
{
	init:function( controller)
	{
		this._super(controller);
	}
});

/********** TOPIC PREVIEW SECTION **********/



/********** TOPIC PREVIEW ITEM SECTION **********/
var TopicPreviewItemSection = Class.extend({

	init:function(controller, topic)
	{
		this.controller=controller;
		this.topic = topic;
		this.element = Mailman.getTemplate('topic-preview');
		this.likedislike = new LikeDislike(this.element.find('.viewslikes'), topic);
		this.update();
	},
	getElement: function() { return this.element; },
	setTopicTitleClickCallback: function(callback, data)
	{
		this.element.find('.topic-title').unbind('click');
		if (data == null)
			this.element.find('.topic-title').click(callback);
		else
			this.element.find('.topic-title').click(data, callback);
	},
	update:function()
	{
		if (!this.element.hasClass('tid-'+this.topic.id))
			this.element.addClass('tid-'+this.topic.id);
		if (!this.element.hasClass('cid-'+this.topic.channelid))
			this.element.addClass('cid-'+this.topic.channelid);

		this.element.find('.postedbytext').html(Engine.lang.field_postedby);
		this.element.find('.ago').html(Engine.lang.field_ago);
		this.element.find('.replies').html(Engine.lang.field_replies);
		this.element.find('.views').html(Engine.lang.field_views);

		//this.element.find('.topic-title').attr('href', ''+this.topic.id+'/'+this.topic.subject_for_url);
		this.element.find('.topic-title').html(this.topic.subject);
		this.element.find('.topic-summary').html(this.topic.subsumedmsg);
		this.element.find('.postedby').find('.author').html(this.topic.author);
		if (this.topic.author.toLowerCase()!=='anon')
			this.element.find('.postedby').find('.author').addClass('regauthor');
		this.element.find('.cb').html(this.topic.replies);
		this.element.find('.co').html(this.topic.views);
		this.likedislike.setLikes(this.topic.likes);
		this.likedislike.setDislikes(this.topic.dislikes);
		this.likedislike.update();
		this.element.find('.timeago').html(this.topic.timeago);

		var classes = this.element.attr('class');
		if (/version-\d+/.test(classes))
			this.element.removeClass( classes.match(/version-(\d+)/)[1] );
		this.element.addClass('version-'+this.topic.version);
		this.element.addClass('orderid-'+this.topic.orderid);


		if (this.topic.isfollowing)
			this.prepareViewToUnfollow();
		else
			this.prepareViewToFollow();

		this.element.find('.topic-preview').unbind('mouseover').mouseover({t:this.element}, function(event){
			event.data.t.find('.follow').removeClass('follow_not_hover');
			event.data.t.find('.follow').addClass('follow_hover');
		});
		this.element.find('.topic-preview').unbind('mouseout').mouseout({t:this.element}, function (event){
			event.data.t.find('.follow').addClass('follow_not_hover');
			event.data.t.find('.follow').removeClass('follow_hover');
		});

		this.element.mouseover({element:this.element}, function(event)
		{
			event.data.element.find('.follow').addClass('follow_hover');
			event.data.element.find('.follow').removeClass('follow_not_hover');
		});
		this.element.mouseout({element:this.element}, function(event)
		{
			event.data.element.find('.follow').addClass('follow_not_hover');
			event.data.element.find('.follow').removeClass('follow_hover');
		});
	},
	updateLikes:function()
	{
		this.likedislike.setLikes(this.topic.likes);
		this.likedislike.setDislikes(this.topic.dislikes);
		this.likedislike.update();
	},
	prepareViewToFollow:function(){
		var t = this.element.find('.follow');
		t.html(Engine.lang.button_follow);
		t.unbind('click').unbind('keypress').clickOrEnter({thi:this},function(event){
			event.data.thi.topic.followTopic();
			Engine.update();
		});
	},
	prepareViewToUnfollow:function(){
		var t = this.element.find('.follow');
		t.html(Engine.lang.button_unfollow);
		t.unbind('click').unbind('keypress').clickOrEnter({thi:this},function(event){
			event.data.thi.topic.unfollowTopic();
			Engine.update();
		});
	},
	destroy: function(){
		this.element.remove();
	}
});

var RecentTopicItemSection = TopicPreviewItemSection.extend({

	init:function( controller, topic)
	{
		this._super(controller, topic);
	}
});


var UFTItemSection = TopicPreviewItemSection.extend({

	init:function( controller, topic)
	{
		this._super(controller, topic);
	}
});

var RecentTopicItemInMainSection = RecentTopicItemSection.extend({

	init:function( controller, topic)
	{
		this._super(controller, topic);
		this.element.find('.logo-med').removeClass('avatar-med');
		this.element.find('.logo-med').clickOrEnter({thi:this},function(event)
		{
			History.appendChannelTab(event.data.thi.topic.channelid);
		});
		this.element.find('.logo-med').mouseenter(function()
		{
			var e = jQuery(this).parent().find('.mouseover-hint-topic-preview').fadeIn('fast');
		});
		this.element.find('.logo-med').click(function()
		{
			var e = jQuery(this).parent().find('.mouseover-hint-topic-preview').hide();
		});
		this.element.find('.logo-med').mouseleave(function()
		{
			jQuery(this).parent().find('.mouseover-hint-topic-preview').fadeOut('fast');
		});
		this.element.find('.mouseover-hint-topic-preview').html('#'+topic.channel);
		this.update();
	},
	update: function()
	{
		this._super();
		this.element.find('.logo-med').attr('src',this.topic.logo('med'));
	}
});


var RecentTopicItemInChannelSection = RecentTopicItemSection.extend({

	init:function( controller, topic)
	{
		this._super(controller, topic);
		this.element.find('.avatar-med').removeClass('logo-med');
		this.element.find('.avatar-med').clickOrEnter({thi:this},function(event){
			History.appendTopicTab(event.data.thi.topic.id);
		});
		this.update();
	},
	update: function()
	{
		this._super();
		this.element.find('.avatar-med').attr('src',this.topic.avatar('med'));
	}
});



var UFTItemInMainSection = UFTItemSection.extend({

	init:function( controller, topic)
	{
		this._super(controller, topic);
		this.element.find('.avatar-med').clickOrEnter({thi:this},function(event)
		{
			History.appendChannelTab(event.data.thi.topic.channelid);
		});
		this.element.find('.avatar-med').mouseenter(function()
		{
			var e = jQuery(this).parent().find('.mouseover-hint-topic-preview').fadeIn('fast');
		});
		this.element.find('.avatar-med').click(function()
		{
			var e = jQuery(this).parent().find('.mouseover-hint-topic-preview').hide();
		});
		this.element.find('.avatar-med').mouseleave(function()
		{
			jQuery(this).parent().find('.mouseover-hint-topic-preview').fadeOut('fast');
		});
		this.element.find('.mouseover-hint-topic-preview').html('#'+topic.channel);
		this.update();
	},
	update: function()
	{
		this._super();
		this.element.find('.avatar-med').attr('src',this.topic.logo('med'));
	}
});


var UFTItemInChannelSection = UFTItemSection.extend({

	init:function(controller, topic)
	{
		this._super(controller, topic);
		this.element.find('.avatar-med').clickOrEnter({thi:this},function(event){
			History.appendTopicTab(event.data.thi.topic.id);
		});
	},
	update: function()
	{
		this._super();
		this.element.find('.avatar-med').attr('src',this.topic.avatar('med'));
	}
});


/********** TOPIC PREVIEW ITEM SECTION **********/

var TopBarSection = Class.extend({

	init: function(controller)
	{
		this.controller = controller;
		this.element = jQuery('#toolbar-wrap');
		this.element.append( Mailman.getTemplate('top-bar') );
		this.element.find('.help-btn').clickOrEnter({thi:this}, function(event)
		{
			if (Engine.isTourRunning())
			{
				Engine.stopTour();
				Engine.update();
			}
			new FastNotice('O sistema de ajuda interativo foi iniciado.');
			Engine.startTour();
			Engine.getThe().main.select();
			Engine.update();
		});
		this.element.find('#input-search').enter({thi:this}, function(event)
		{
			History.appendSearchChannelsListTab(event.data.thi.element.find('#input-search').val());
			var s = event.data.thi.element.find('#input-search');
			s.val('');
			s.blur();
		});
		activate_input_placeholder(this.element.find('#input-search'));
		this.element.find('.search-button').clickOrEnter({thi:this}, function(event)
		{
			History.appendSearchChannelsListTab(event.data.thi.element.find('#input-search').val());
			var s = event.data.thi.element.find('#input-search');
			s.val('');
			s.blur();
		});
	},
	update: function()
	{
	},
	destroy: function()
	{
		this.element.html('');
	},
	setUserTool: function(elem)
	{
		this.element.find('#user-tool').html('').append(elem);
	},
	setChannelTool: function (elem){
		this.element.find('#channel-tool').html('').append(elem);
	},
	getElement: function()
	{
		return this.element;
	},
	initMenu: function()
	{
		var childrens = this.element.find('.tool-item');
		for (var i = 0; i < childrens.length; i++)
		{
			var t = jQuery(childrens[i]);
			var handler = function(event)
			{
				var t = jQuery(this);
				if (t.next().css('display')=='none')
				{
					t.removeClass('tool-item-hover');
					event.data.topbar.closeOpenMenu();
					t.next().show();
					t.addClass('tool-item-selected');
	
					var inputs=t.next().find('input');
					if (inputs.length > 0)
						inputs.first().focus();
				} else {
					event.data.topbar.closeOpenMenu();
					t.addClass('tool-item-hover');
				}
			};
			t.unbind('click',handler).click({topbar:this},handler);
			var handler = function()
			{
				var t = jQuery(this);
				if (!t.hasClass('tool-item-selected'))
					t.addClass('tool-item-hover');
			}
			t.unbind('mouseenter',handler).mouseenter(handler);
			var handler = function()
			{
				jQuery(this).removeClass('tool-item-hover');
			}
			t.unbind('mouseleave',handler).mouseleave(handler);
		}
		var handler = function(event)
		{
			event.data.thi.closeOpenMenu();
		};
		this.element.find('.tool-menu').find('.link').unbind('click',handler).click({thi:this},handler);
		this.element.find('.tool-menu').find('span.a').unbind('click',handler).click({thi:this},handler);
	},
	closeOpenMenu: function()
	{
		var childrens = this.element.find('.tool-item');
		for (var i = 0; i < childrens.length; i++)
		{
			var t = jQuery(childrens[i]);
			t.next().hide();
			t.removeClass('tool-item-selected');
		}
	}
});

var ForgotPasswordSection = Class.extend({

	init: function(controller)
	{
		this.controller = controller;

		var s = new SimpleNotice();
		s.setTitle('Criação de uma nova senha');
		s.setMsg(Engine.lang.msg_forgotpassword);
		s.addInputLabel('e-mail');

		var closure = (function(controller,s)
		{
			return function()
			{
				if (!s.getInputValue(1))
					return;
				s.setLoading();
				controller.resetPassword(s.getInputValue(1), {s:s}, function(r, data)
				{
					data.s.unsetLoading();
					if (r.ok)
					{
						new FastNotice(Engine.lang.msg_forgetpwd_sendingemail);
						data.s.destroy();
					} else
						new SimpleNotice('Alerta', Engine.lang.msg_failed+': '+beautify_error(r.error));

				});
			};
		})(this.controller,s);
		s.setOkCallback(closure);
		s.show();
	}
});

var TopBarAnonSection = Class.extend({

	init: function(controller)
	{
		this.controller = controller;
		this.element = Mailman.getTemplate('anonusertool');

		var check = function(event)
		{
			if (event.data.t.checkSigninFields())
			{
				var nickemail = event.data.t.element.find('#signin-nickname-email').val();
				var password = event.data.t.element.find('#signin-password').val();
				if (event.data.t.element.find('#signin-check').attr('checked'))
					var staylogged = true;
				else
					var staylogged = false;

				event.data.t.controller.signin(nickemail, password, staylogged);
			}
			return false;
		}

		this.element.find('#signin-enter').clickOrEnter({t:this}, check);
		var t = this.element.find('input');
		for (var i = 0; i < 2; i++)
			jQuery(t[i]).enter({t:this}, check);

		this.element.find('.create-user-btn').click({controller:this.controller},function(event)
		{
			event.data.controller.showCreateUser();
			Engine.update();
		});

		this.element.find('.forgotpassword').click({thi:this},function(event)
		{
			new ForgotPassword();
		})

		this.update();
	},
	setWait:function()
	{
		this.element.find('#signin-enter').css('visibility','hidden');
		this.element.find('#signin-enter-wait').show();
	},
	unsetWait:function()
	{
		this.element.find('#signin-enter').css('visibility','visible');
		this.element.find('#signin-enter-wait').hide();
	},
	resetPassword:function(email, data, callback)
	{
		this.controller.resetPassword(email, data, callback);
	},
	destroy:function()
	{
		this.element.remove();
	},
	checkSigninFields: function()
	{
		var nickemail = this.element.find('#signin-nickname-email').val();
		var password = this.element.find('#signin-password').val();

		this.element.find('.input-alert').removeClass('input-alert');

		if (nickemail.length==0)
			this.element.find('#signin-nickname-email').addClass('input-alert');
		if (password.length==0)
			this.element.find('#signin-password').addClass('input-alert');

		if (this.element.find('.input-alert').length>0)
			this.element.find('.input-alert').first().focus();
		else
			return true;

		return false;
		
	},
	getElement: function()
	{
		return this.element;
	},
	update: function(){
		this.element.find('#signin').html(Engine.lang.menu_signin);
		this.element.find('.nickname').html(Engine.lang.field_nicknameoremail);
		this.element.find('.passwordtext').html(Engine.lang.field_password);
		this.element.find('.keeplogged').html(Engine.lang.field_keeplogged);
		this.element.find('#signin-enter').val(Engine.lang.field_enter);
		this.element.find('.create-user-btn').html(Engine.lang.field_newuser);
		this.element.find('.forgotpassword').html(Engine.lang.field_forgotpassword);
	}
});


var TopBarUserSection = Class.extend({

	init: function(controller)
	{
		this.controller = controller;
		this.element = Mailman.getTemplate('regusertool');
		this.element.find('#account-tool').html( Engine.getMyUserSession().nickname );
		this.element.find('.signout').click({controller:this.controller},function(event)
		{
			event.data.controller.signout();
			Engine.update();
		});
		this.element.find('.myaccount').click({controller:this.controller},function(event)
		{
			event.data.controller.showMyAccount();
		});
		this.element.find('.my-channels').click({controller:this.controller},function(event)
		{
			History.appendSearchChannelsListTab('[mychannels]');
		});
		var handler = function(event)
		{
			event.data.controller.showCreateChannel();
			Engine.update();
		}
		this.element.find('.create-channel').unbind('click',handler).click({controller:this.controller},handler);
		this.update();
	},
	update: function()
	{
		this.element.find('img.avatar-small').attr('src', Engine.getMyUserSession().avatar('small') );
		this.element.find('.myaccount').html(Engine.lang.field_myaccount);
		this.element.find('.create-channel').html(Engine.lang.field_createchannel);
		this.element.find('.signout').html(Engine.lang.field_signout);
	},
	setWait:function()
	{
	},
	unsetWait:function()
	{
	},
	getElement: function()
	{
		return this.element;
	},
	destroy:function()
	{
		this.element.remove();
	}
});

var TourView = Class.extend({

	init: function(controller, tipname)
	{
		this.controller = controller;
		this.tipname = tipname;
		if (tipname == 'banner')
			this.createBannerTip();
		if (tipname == 'user start')
			this.createUserStartTip();
		if (tipname == 'channel search')
			this.createChannelSearchTip();
		if (tipname == 'main tip')
			this.createMainTip();
	},
	createMainTip: function()
	{
		this.setCommonConf('main-tip-tour');
		var user = Engine.getMyUserSession();
		if (user.get('anon'))
		{
			this.tip.find('div.text').html('Seja bem-vindo, usuário anônimo. Esta é a sua página principal. Na coluna abaixo, ao lado esquerdo, estão listados os tópicos mais recentes criados nos canais que oferecemos. Clique nos seus títulos para visualizá-los por inteiro. Na coluna à direta mostramos alguns dos canais que oferecemos. Você poderá assiná-los quando se cadastrar, o que pode ser feito no menu <i>Iniciar</i> da barra superior.');
		} else {
			var nick = user.get('nickname');
			this.tip.find('div.text').html('Seja bem-vindo, <span class="nick">'+nick+'</span>. Esta é a sua página principal. Na coluna abaixo, ao lado esquerdo, estão listados os tópicos mais recentes dos canais assinados por você. Clique nos seus títulos para visualizá-los por inteiro. Na coluna à direta mostramos alguns canais que talvez lhe interesse. Além disso, também mostramos os canais assinados que você mais visita.');
		}

	},
	createBannerTip: function()
	{
		this.setCommonConf('tip-banner');
	},
	createUserStartTip: function()
	{
		if (Engine.getMyUserSession().get('anon'))
			this.setCommonConf('toolbar-tip-anon-start');
		else
			this.setCommonConf('toolbar-tip-user-start');
	},
	createChannelSearchTip: function()
	{
		this.setCommonConf('toolbar-tip-channel-search');
	},
	setCommonConf: function(idname)
	{
		this.tip = jQuery('#'+idname);
		this.tip.slideDown(function()
		{
			jQuery(this).show();
		});
		this.tip.find('input.tip-button-good').unbind().click({thi:this}, function(event)
		{
			event.data.thi.controller.next();
		});
		this.tip.find('input.tip-button-bad').unbind().click({thi:this}, function(event)
		{
			Engine.stopTour();
		});
	},
	destroy: function()
	{
		this.tip.find('*').unbind();
		this.tip.slideUp(function()
		{
			jQuery(this).hide();
		});
	}
});

var TopicTabPage = Class.extend({

	init: function(controller, topic)
	{
		this.controller = controller;
		this.topic = topic;
		this.element = Mailman.getTemplate('topic');
		this.likedislike = new LikeDislike(this.element.find('.viewslikes'), topic);
		this.tinymce = new TinyMCE(0, 'add-post-'+topic.id, true);
		this.tinymce_edit = new TinyMCE(0, 'edit-box-topic-'+this.topic.id, true);

		this.element.find('.edit-box-topic').attr('id',this.element.find('.edit-box-topic').attr('id')+topic.id);
		this.element.find('.edit-bar-topic').attr('id',this.element.find('.edit-bar-topic').attr('id')+topic.id);

		this.element.find('textarea.add-post').attr('id','add-post-'+topic.id);
		this.bindAddPostFocusIn();
		
		this.element.find('.edit').clickOrEnter({thi:this,elem:this.element},function(event)
		{
			var tinymce = event.data.thi.tinymce_edit;
			if (tinymce.isInitialized())
			{
				tinymce.scroll();
				return false;
			}
			tinymce.setWidth(CONF['width_post']);
			tinymce.setHeight(CONF['height_post']);
			tinymce.setAutoFocus(true);

			tinymce.setInitialContent(event.data.thi.topic.msg);
			tinymce.setAutoScroll();
			tinymce.initEditor();

			var t = event.data.elem.find('.edit-bar-topic');
			t.css('display','block');			

			t.find('.button-good').val('Atualiza').unbind().clickOrEnter({t:event.data.thi,tid:event.data.thi.topic.id}, function(event)
			{
				event.data.t.controller.updateTopic();
				event.data.t.cancelEdit();
				Engine.update();
			});
			t.find('.button-bad').val('Cancela').unbind().clickOrEnter({t:event.data.thi}, function(event)
			{
				event.data.t.cancelEdit();
			});
			return false;
		});
		try {
			var addthis_config = {"data_track_clickback":true};
			var addthis_share =
			{
				url:'http://rapidcoffee.com/topic/'+topic.get('id')+'/'+topic.get('subject_for_url'),
				title:topic.get('subject'),
				description:topic.get('subsumedmsg'),
				templates: {
					twitter: 'Visitem o tópico \"{{title}}\" no #rapidcoffee: {{url}}.'
				},
				email_template:'topic_template'
			};
			var tool = this.element.find('.addthis_toolbox');
			addthis.toolbox(tool.get(0), addthis_config, addthis_share);
		} catch(e) { console.log('no addthis this time.'); }

		this.update();
	},
	bindAddPostFocusIn: function()
	{
		this.element.find('#add-post-'+this.topic.id).unbind('focusin').focusin({thi:this,elem:this.element,tid:this.topic.id},function(event)
		{
			if (Engine.getMyUserSession().get('anon'))
				new FastNotice('Lembre-se que você não está logado.');
			var textarea = jQuery(this);
			textarea.unbind('focusin');
			var li = textarea.parent();

			var t = event.data.thi.tinymce;
			t.setWidth(CONF['width_post']);
			t.setHeight(CONF['height_post']);
			t.setAutoFocus(true);
			t.setAutoScroll();

			var handler = (function(t)
			{
				return function()
				{
					t.slideDown('fast');
					t.find('.button-ok').val('Responde').unbind().clickOrEnter({t:event.data.thi}, function(event)
					{
						event.data.t.controller.createPost();
					});
					t.find('.button-cancel').val('Cancela').unbind().clickOrEnter({t:event.data.thi}, function(event)
					{
						event.data.t.cancelPost();
						event.data.t.bindAddPostFocusIn();
					});
				}
			})(event.data.elem.find('#add-post-'+event.data.tid).parent().parent().find('.add-topic-bar'));
			event.data.thi.tinymce.setOnInit(handler);

			textarea.prop('placeholder','');
			textarea.effect("size", {to:{height:CONF['height_post'],width:CONF['width_post']-14},scale:'box'}, 'fast', (function(event)
			{
				return function() {event.data.thi.tinymce.initEditor();};
			})(event));
		});
	},
	cancelPost: function()
	{
		this.tinymce.destroy();
		this.element.find('textarea.add-post').val('').blur().prop('placeholder','escreva alguma coisa como resposta').height(50).width(400);
		this.element.find('.add-topic-bar').css('display','none');
		this.element.find('li.add-post').height('auto');
	},
	cancelEdit: function()
	{
		this.tinymce_edit.destroy();
		this.element.find('.edit-box-topic').html('');
		this.element.find('.edit-box-topic').blur();
		this.element.find('.edit-bar-topic').css('display','none');
	},
	getEditTopicMsg: function()
	{
		return this.tinymce_edit.getContent();
	},
	getMsg: function()
	{
		return this.tinymce.getContent();
	},
	update: function()
	{
		if (!this.element.hasClass('tid-'+this.topic.id))
			this.element.addClass('tid-'+this.topic.id);
		if (!this.element.hasClass('cid-'+this.topic.channelid))
			this.element.addClass('cid-'+this.topic.channelid);


		this.element.find('.something-tell').html(Engine.lang.field_somethingtell);
		this.element.find('.qtpoststext').html(Engine.lang.field_qtpoststext);
		this.element.find('.postedbytext').html(Engine.lang.field_postedby);
		this.element.find('.ago').html(Engine.lang.field_ago);
		this.element.find('.replies').html(Engine.lang.field_replies);
		this.element.find('.views').html(Engine.lang.field_views);

		var pup = jQuery.proxy(function()
		{
			History.appendPublicUserPage(this.topic.get('user').get('id'));
		},this);
		var thead = this.element.find('.topic-head');
		thead.find('.avatar-med').attr('src',this.topic.avatar('med')).unbind().click(pup);
		thead.find('.user .level').html( this.topic.get('user').get('level') );
		thead.find('.user .reputation').html( this.topic.get('user').get('reputation') );
		thead.find('.topic-title').html(this.topic.subject);
		
		thead.find('.topic-msg').html(this.topic.msg);
		thead.find('.topic-msg').find('a').each(function()
		{
			rcanchor(jQuery(this));
		});

		thead.find('.signature').html(this.topic.signature);
		thead.find('.postedby').find('.author').html(this.topic.author).unbind().click(pup);
		if (this.topic.author.toLowerCase()!='anon')
			thead.find('.postedby').find('.author').addClass('regauthor');
		thead.find('.cb').html(this.topic.replies);
		thead.find('.co').html(this.topic.views);
		this.likedislike.setLikes(this.topic.likes);
		this.likedislike.setDislikes(this.topic.dislikes);
		this.likedislike.update();
		thead.find('.timeago').html(this.topic.timeago);
		this.element.find('.qtposts').html(this.topic.replies);

		if (this.topic.isfollowing)
			this.prepareViewToUnfollow();
		else
			this.prepareViewToFollow();

		thead.unbind('mouseover').mouseover({t:thead}, function(event){
			event.data.t.find('.follow').removeClass('follow_not_hover');
			event.data.t.find('.follow').addClass('follow_hover');
		});
		thead.unbind('mouseout').mouseout({t:thead}, function (event){
			event.data.t.find('.follow').addClass('follow_not_hover');
			event.data.t.find('.follow').removeClass('follow_hover');
		});
		if (!Engine.getMyUserSession().anon && this.topic.author==Engine.getMyUserSession().nickname){
			thead.find('#edit-box-topic-').attr('id','edit-box-topic-'+this.topic.id);
			thead.find('#edit-bar-topic-').attr('id','edit-bar-topic-'+this.topic.id);
			thead.find('.edit').html('Editar');

			thead.mouseover({t:thead}, function(event)
			{
				event.data.t.find('.edit').removeClass('edit_not_hover');
				event.data.t.find('.edit').addClass('edit_hover');
			});
			thead.mouseout({t:thead}, function(event){
				event.data.t.find('.edit').addClass('edit_not_hover');
				event.data.t.find('.edit').removeClass('edit_hover');
			});
		}

		
		var classes = this.element.attr('className');
		if (typeof classes !== 'undefined' && classes !== false)
		{
			var versionclass = classes.match(/version-(\d+)/);
			if (versionclass)
				this.element.removeClass( 'version-' + versionclass[1] );
		}
		
		this.element.addClass('version-'+this.topic.version);
	},
	updateLikes:function()
	{
		this.likedislike.setLikes(this.topic.likes);
		this.likedislike.setDislikes(this.topic.dislikes);
		this.likedislike.update();
	},
	prepareViewToFollow:function(){
		var t = this.element.find('.topic-head').find('.follow');
		t.html('seguir');
		t.unbind('click').unbind('keypress').clickOrEnter({thi:this},function(event){
			event.data.thi.topic.followTopic();
			Engine.update();
		});
	},
	prepareViewToUnfollow:function(){
		var t = this.element.find('.topic-head').find('.follow');
		t.html('não seguir');
		t.unbind('click').unbind('keypress').clickOrEnter({thi:this},function(event){
			event.data.thi.topic.unfollowTopic();
			Engine.update();
		});
	},
	getElement:function()
	{
		return this.element;
	},
	getTitle:function()
	{
		return this.element.find('.topic-title').html();
	},
	appendPost:function(postElem)
	{
		if (this.animation!=null)
		{
			postElem.hide();
			this.animation.push('slideDown',postElem);
		}
		this.element.find('.posts').append(postElem);
	},
	prependPost:function(postElem)
	{
		if (this.animation!=null)
		{
			postElem.hide();
			this.animation.push('slideDown',postElem);
		}
		this.element.find('.posts').prepend(postElem);
	},
	initTinyMCE: function()
	{
		this.tinymce.initEditor();
		this.tinymce_edit.initEditor();
	},
	prepareAnimation:function()
	{
		this.animation = new Animation();
	},
	startAnimation:function()
	{
		this.animation.start();
		this.animation = null;
	},
	setPostLoading:function(b)
	{
		if (b)
		{
			this.element.find('.add-topic-bar .load-icon-small').css('visibility','visible');
		} else {
			this.element.find('.add-topic-bar .load-icon-small').css('visibility','hidden');
		}
	}
});


var TopicTabPostSection = Class.extend({

	init: function(controller, post)
	{
		this.element = Mailman.getTemplate('post');
		this.likedislike = new LikeDislike(this.element.find('.viewslikes'), post);
		this.controller = controller;
		this.post = post;
		this.tinymce_edit = new TinyMCE(0, 'edit-box-post-'+this.post.id, true);

		this.element.find('.edit').clickOrEnter({thi:this,elem:this.element},function(event)
		{
			var t = event.data.thi.tinymce_edit;
			if (t.isInitialized())
			{
				t.scroll();
				return false;
			}

			t.setWidth(CONF['width_post']);
			t.setHeight(CONF['height_post']);
			t.setAutoFocus(true);
			t.setInitialContent(event.data.thi.post.get('post'));
			t.setAutoScroll();
			t.initEditor();

			var t = event.data.elem.find('.edit-bar-post');
			t.css('display','block');			

			t.find('.button-good').val('Atualiza').unbind().clickOrEnter({t:event.data.thi}, function(event)
			{
				event.data.t.controller.updatePost();
				event.data.t.cancelEdit();
			});
			t.find('.button-bad').val('Cancela').unbind().clickOrEnter({t:event.data.thi}, function(event)
			{
				event.data.t.cancelEdit();
			});
		});

		this.update();
	},
	getElement: function()
	{
		return this.element;
	},
	cancelEdit: function()
	{
		this.tinymce_edit.destroy();
		this.element.find('.edit-box-post').html('');
		this.element.find('.edit-box-post').blur();
		this.element.find('.edit-bar-post').css('display','none');
	},
	getEditPostMsg: function()
	{
		return this.tinymce_edit.getContent();
	},
	update: function()
	{
		var pup = jQuery.proxy(function()
		{
			History.appendPublicUserPage(this.post.get('user').get('id'));
		},this);

		this.element.find('.avatar-med').attr('src',this.post.avatar('med')).unbind().click(pup);
		this.element.find('.post-avatar-sec .level').html(this.post.get('user').get('level'));
		this.element.find('.post-avatar-sec .reputation').html(this.post.get('user').get('reputation'));


		this.element.find('.postedbytext').html(Engine.lang.field_postedby);
		this.element.find('.ago').html(Engine.lang.field_ago);

		this.element.addClass('pid-'+this.post.id);
		this.element.find('.post-content').find('.msg').html(this.post.post);
		this.element.find('.post-content').find('a').each(function()
		{
			rcanchor(jQuery(this));
		});

		this.element.find('.postedby').find('.author').html(this.post.author).unbind().click(pup);
		if (this.post.author.toLowerCase()!='anon')
			this.element.find('.postedby').find('.author').addClass('regauthor');
		this.element.find('.postedby').find('.author').html(this.post.author);
		this.element.find('.postedby').find('.timeago').html(this.post.timeago);
		this.element.find('#edit-box-post-XXX').attr('id','edit-box-post-'+this.post.id);
		this.element.find('#edit-bar-post-XXX').attr('id','edit-bar-post-'+this.post.id);

		this.likedislike.setLikes(this.post.likes);
		this.likedislike.setDislikes(this.post.dislikes);
		this.likedislike.update();
		this.element.find('.signature').html(this.post.signature);

		if (!Engine.getMyUserSession().anon && this.post.author==Engine.getMyUserSession().nickname){
			this.element.find('#edit-box-post-').attr('id','edit-box-post-'+this.post.id);
			this.element.find('#edit-bar-post-').attr('id','edit-bar-post-'+this.post.id);
			this.element.find('.edit').html('Editar');
			this.element.find('.post-content').unbind('mouseover').mouseover({thi:this}, function(event)
			{
				event.data.thi.element.find('.edit').removeClass('edit_not_hover');
				event.data.thi.element.find('.edit').addClass('edit_hover');
			});
			this.element.find('.post-content').unbind('mouseout').mouseout({thi:this}, function(event)
			{
				event.data.thi.element.find('.edit').addClass('edit_not_hover');
				event.data.thi.element.find('.edit').removeClass('edit_hover');
			});
		}
	},
	updateLikes:function()
	{
		this.likedislike.setLikes(this.post.likes);
		this.likedislike.setDislikes(this.post.dislikes);
		this.likedislike.update();
	}
});

var CreateChannelPage = Class.extend({

	init:function(controller)
	{
		this.expandcallback = function(){};
		this.descriptionbox = new ChannelDescription('');
		this.controller = controller;
		this.element = Mailman.getTemplate('create-channel');
		this.element.find('div.channel-description').append(this.descriptionbox.getTextarea());
		this.element.find('div.description-counter').append(this.descriptionbox.getCounter());
		this.element.find('div.big-btn').clickOrEnter({controller:controller},function(event)
		{
			event.data.controller.createChannel();
			Engine.update();
		});
		this.element.find('input.name').keypress({thi:this},function(event)
		{
			return event.data.thi.fieldNameKeyPress(event);
		});
		this.element.find('input.name').blur({thi:this},function(event)
		{
			return event.data.thi.fieldNameBlur(event);
		});
		this.update();
	},
	getElement: function()
	{
		return this.element;
	},
	getName:function()
	{
		return this.element.find('input.name').val();
	},
	getDescription:function()
	{
		return this.descriptionbox.getDescription();
	},
	getLanguage:function()
	{
		return this.element.find('select.language').val();
	},
	fieldNameKeyPress:function(event)
	{
		return true;
	},
	fieldNameBlur:function(event)
	{
		var name = this.element.find('input.name').val();
		name = this.clearName(name);
		this.element.find('input.name').val(name);
		var notice = this.element.find('div.notice-name');
		this.clearNotice(notice);
		if (name.length==0)
		{
			notice.addClass('bad-notice').html('você precisa preencher');
		} else
		{
			Mailman.checkChannelName(name, {thi:this}, function(response, data)
			{
				var notice = data.thi.element.find('div.notice-name');
				data.thi.clearNotice(notice);
				data.thi.element.find('span.url').html("");
				if (!response.ok)
				{
					notice.addClass('bad-notice');
					notice.html(response.error);
				} else {
					if (response.exist)
					{
						notice.addClass('bad-notice');
						notice.html('this name has already been taken');
					} else {
						data.thi.element.find('span.url').html("http://rapidcoffee.com/channel/"+response.prettyUrl);
						notice.addClass('good-notice');
						notice.html(Engine.lang.msg_itsok);
					}
				}
			});
			Engine.update();
		}
		return true;
	},
	clearName:function(name)
	{
		var match = new RegExp('[^a-z0-9 \-+!@#$%&*()=_{}\]\[\|"\'\/?<>,.\\' + ACCENTS + ':;]','ig');

		name = name.replace(match, '');
		name = name.replace(/  +/g,' ');
		return jQuery.trim(name);
	},
	clearNotice:function(elem)
	{
		elem.removeClass('notsogood-notice').removeClass('good-notice').removeClass('bad-notice');
		elem.html('');
	},
	update:function()
	{
			this.element.find('.title').html(Engine.lang.lines_createchannel);
			this.element.find('.name-label').html(Engine.lang.field_chadm_name);
			this.element.find('.name-msg').html(Engine.lang.field_chadm_name_msg);
			this.element.find('.url-label').html(Engine.lang.field_chadm_url);
			this.element.find('.url-msg').html(Engine.lang.field_chadm_url_msg);
			this.element.find('.channel-description-label').html(Engine.lang.field_chadm_description);
			this.element.find('.channel-description-msg').html(Engine.lang.field_chadm_description_msg);
			//this.element.find('.lang').html(Engine.lang.field_chadm_lang);
			//this.element.find('.lang_msg').html(Engine.lang.field_chadm_lang_msg);
			//this.element.find('.lang_pt_br').html(Engine.lang.field_lang_pt_br);
			//this.element.find('.lang_en_us').html(Engine.lang.field_lang_en_us);
			this.element.find('.create-channel').html(Engine.lang.button_chadm_create);
	},
	showCongratulations:function(channel)
	{
		new FastNotice(Engine.lang.msg_createdchannel);
		self.scroll(0,0);
		var e = Mailman.getTemplate('channel-create-congratulations');
		e.find('.congrat-text').html(Engine.lang.msg_channelcreatedcongrat);
		e.find('.channel-name').html(channel.name);
		e.find('.gochannel').find('.text').html(Engine.lang.button_gochannel);
		e.find('.gopanel').find('.text').html(Engine.lang.button_gopanel);
		e.find('.gochannel').click({thi:this,id:channel.id},function(event)
		{
			//event.data.thi.controller.tab.close();
			History.appendChannelTab(event.data.id);
		});
		e.find('.gopanel').click({thi:this,id:channel.id},function(event)
		{
			//event.data.thi.controller.tab.close();
			History.appendChannelAdmin(event.data.id);
		});
		this.element.html('').append(e);
		Engine.getThe().initBigButtons();
	},
	setLoading: function()
	{
		this.element.find('.load-icon-small').css('visibility','visible');
	},
	unsetLoading: function()
	{
		this.element.find('.load-icon-small').css('visibility','hidden');
	}
});


var CreateUserPage = Class.extend({

	init: function(controller)
	{
		this.controller = controller;
		Mailman.getTemplate('create-user', {thi:this}, function(data, e)
		{
			data.thi.element = e;
			data.thi.finalizeInit();
		});
	},
	finalizeInit:function()
	{
		this.element.find('.email').blur({thi:this},function(event)
		{
			event.data.thi.fieldEMailBlur();
		});
		this.element.find('.email').keypress({thi:this},function(event)
		{
			event.data.thi.fieldEMailKeyPress();
		});
		this.element.find('.nickname').blur({thi:this},function(event)
		{
			event.data.thi.fieldNicknameBlur();
		});
		this.element.find('.nickname').keydown({thi:this},function(event)
		{
			event.data.thi.fieldNicknameKeyDown();
		});
		this.element.find('.nickname').keyup({thi:this},function(event)
		{
			event.data.thi.fieldNicknameKeyUp();
		});
		this.element.find('.password1').keyup({thi:this},function(event)
		{
			event.data.thi.fieldPasswordKeyUp();
		});
		this.element.find('.password1').blur({thi:this},function(event)
		{
			event.data.thi.fieldPasswordBlur();
		});
		this.element.find('.password2').keyup({thi:this},function(event)
		{
			event.data.thi.fieldPassword2Keyup(event);
		});

		this.element.find('div.big-btn-green').clickOrEnter({controller:this.controller},function(event)
		{
			event.data.controller.createUser();
		});

		this.update();

		var closure = (function(thi)
		{
			return function()
			{
				thi.controller.finalizeInit();
			};
		})(this);

		// faco isso pq o metodo CreateUserTab.finalizeInit
		// assume que este objeto ja foi instanciado
		setTimeout(closure, 0);
	},
	fieldEMailKeyPress:function(event)
	{
		return true;
	},
	fieldEMailBlur:function(event)
	{
		var email = this.element.find('.email').val();
		var notice = this.element.find('.notice-email');
		this.clearNotice(notice);
		if (email.length==0)
		{
			notice.addClass('bad-notice').html(Engine.lang.msg_youmusttypeemail);
		} else {
			if (!this.controller.checkLettersEmail()){
				notice.addClass('bad-notice');
				notice.html(Engine.lang.msg_incorrectemail);
				return;
			}
			if (!this.controller.checkAvailableEmail()){
				notice.addClass('bad-notice');
				notice.html(Engine.lang.msg_emailalreadyinuse);
			} else {
				notice.addClass('good-notice');
				notice.html(Engine.lang.msg_itsok);
			}
		}
	},
	fieldNicknameKeyDown:function(event)
	{
	},
	fieldNicknameKeyUp:function(event)
	{
	},
	fieldNicknameBlur:function(event)
	{
		this.setNickname(clearNickname(this.getNickname()));

		var nickname = this.element.find('.nickname').val();
		var notice = this.element.find('.notice-nickname');
		this.clearNotice(notice);
		if (nickname.length==0)
		{
			notice.addClass('bad-notice').html(Engine.lang.msg_musttypenick);
		} else {
			if (!this.controller.checkAvailableNickname()){
				notice.addClass('bad-notice');
				notice.html(Engine.lang.msg_nickalreadyinuse);
			} else {
				notice.addClass('good-notice');
				notice.html(Engine.lang.msg_itsok);
			}
		}
	},
	fieldPasswordKeyUp:function()
	{
		var pass = this.getPassword();
		var notice = this.element.find('.notice-password1');
		this.clearNotice(notice);
		if (pass.length>0)
		{
			var score = password_strength(pass);
			if (score < 2)
			{
				notice.addClass('bad-notice');
				notice.html(password_strength_desc(score));
			} else if (score < 4) {
				notice.addClass('notsogood-notice');
				notice.html(password_strength_desc(score));
			} else {
				notice.addClass('good-notice');
				notice.html(password_strength_desc(score));
			}
		}
	},
	fieldPasswordBlur:function()
	{
		var password2 = this.element.find('.password2').val();
		var notice = this.element.find('.notice-password2');
		this.clearNotice(notice);
		if (password2.length>0)
		{
			if (!this.controller.checkPasswords()){
				notice.addClass('bad-notice');
				notice.html(Engine.lang.msg_differentpwd);
				return;
			} else {
				notice.addClass('good-notice');
				notice.html(Engine.lang.msg_itsok);
			}
		}
	},
	fieldPassword2Keyup:function(event)
	{
		if (event.which)
			var keycode = event.which;
		else
			var keycode = event.keyCode;

		if (keycode == 13)
		{
			this.element.find('div.big-btn-green').click();
			return;
		}

		var password2 = this.element.find('.password2').val();
		var notice = this.element.find('.notice-password2');
		this.clearNotice(notice);
		if (password2.length==0)
		{
			notice.addClass('bad-notice').html(Engine.lang.msg_retypepwd);
		} else {
			if (!this.controller.checkPasswords()){
				notice.addClass('bad-notice');
				notice.html(Engine.lang.msg_differentpwd);
				return;
			} else {
				notice.addClass('good-notice');
				notice.html(Engine.lang.msg_itsok);
			}
		}
	},
	getElement: function()
	{
		return this.element;
	},
	getEmail: function()
	{
		return this.element.find('.email').val();
	},
	getNickname: function()
	{
		return this.element.find('.nickname').val();
	},
	setNickname: function(nickname)
	{
		this.element.find('.nickname').val(nickname);
	},
	getPassword: function()
	{
		return this.element.find('.password1').val();
	},
	getPassword2: function()
	{
		return this.element.find('.password2').val();
	},
	clearNotice:function(elem)
	{
		elem.removeClass('notsogood-notice').removeClass('good-notice').removeClass('bad-notice');
		elem.html('');
	},
	update:function()
	{
		this.element.find('.title').html(Engine.lang.lines_createyouraccount);
		this.element.find('.email-label').html(Engine.lang.field_email);
		this.element.find('.email-msg').html(Engine.lang.field_email_msg);
		this.element.find('.nickname-label').html(Engine.lang.field_nickname);
		this.element.find('.nickname-msg').html(Engine.lang.field_nickname_msg);
		this.element.find('.password1-label').html(Engine.lang.field_password);
		this.element.find('.password1-msg').html(Engine.lang.field_password_msg);
		this.element.find('.password2-label').html(Engine.lang.field_retypepassword);
		this.element.find('.password2-msg').html(Engine.lang.field_retypepassword_msg);
		this.element.find('.createaccount').html(Engine.lang.button_createaccount);
	},
	showCongratulations:function(nickname, email, password)
	{
		new FastNotice(Engine.lang.msg_accountcreated);
		self.scroll(0,0);
		var e = Mailman.getTemplate('create-user-congratulations');
		e.find('.congrat-text').html(Engine.lang.msg_usercreatedcongrat);
		e.find('.closetab .text').html(Engine.lang.button_closethistab);
		e.find('.user-creation-congrat .nickname').html(nickname);
		e.find('.user-creation-congrat .email').html(email);
		e.find('.closetab').click({thi:this,nick:nickname,pass:password},function(event)
		{
			event.data.thi.controller.continueSignedIn(event.data.nick, event.data.pass);
		});
		this.element.html('').append(e);
		Engine.getThe().initBigButtons();
	},
	setLoading: function()
	{
		this.element.find('.load-icon-small').css('visibility','visible');
	},
	unsetLoading: function()
	{
		this.element.find('.load-icon-small').css('visibility','hidden');
	}
});


var MyAccountPage = Class.extend({

	init: function(user, controller)
	{
		this.user=user;
		this.controller = controller;
		this.element = Mailman.getTemplate('myaccount');

		this.element.find('input.pass1').blur({thi:this},function(event)
		{
			event.data.thi.fieldPassword2Blur();
		});
		this.element.find('input.pass2').keyup({thi:this},function(event)
		{
			event.data.thi.fieldPassword2Blur();
		});
		
		this.element.find('input.signature').keyup({thi:this},function(event)
		{
			event.data.thi.fieldSignatureKeyUp();
		});
		this.element.find('input.signature').enter({thi:this},function(event)
		{
			if (event.data.thi.check())
			{
				event.data.thi.controller.updateUser();
				Engine.update();
			}
		});
		this.element.find('div.big-btn').clickOrEnter({thi:this},function(event)
		{
			if (event.data.thi.check())
			{
				event.data.thi.controller.updateUser();
				Engine.update();
			}
		});
		this.element.find('input.pass1').enter({thi:this},function(event)
		{
			if (event.data.thi.check())
			{
				event.data.thi.controller.updateUser();
				Engine.update();
			}
		});
		this.element.find('input.pass2').enter({thi:this},function(event)
		{
			if (event.data.thi.check())
			{
				event.data.thi.controller.updateUser();
				Engine.update();
			}
		});
		this.update();
	},
	setLoading:function()
	{
		this.element.find('load-icon-small').css('visibility','visible');
	},
	unsetLoading:function()
	{
		this.element.find('load-icon-small').css('visibility','hidden');
	},
	updateAvatar: function()
	{
		this.imageedition.setImageSrcFinal(this.user.avatar('big'));
	},
	crop: function(index, x1, x2, y1, y2)
	{
		this.controller.crop(this.imageedition.getFilename(), this.user.id, x1, x2, y1, y2);
	},
	getFileElementId: function()
	{
		return 'file-avatar-'+this.user.id;
	},
	showAvatarEdition:function(filename)
	{
		this.filename = filename;
		this.imageedition.showEditionPanel(filename);
	},
	check:function()
	{
		var pass1 = this.getPassword();
		var pass2 = this.getPassword2();
		if (pass1.length>0 && pass1!=pass2)
		{
			this.element.find('input.pass1').addClass('input-alert');
			this.element.find('input.pass2').addClass('input-alert');
			this.element.find('.notice-pass2').html('As senhas estão diferentes');
			this.element.find('.notice-pass2').addClass('bad-notice').removeClass('good-notice');
			return false
		}
		this.element.find('.pass1').removeClass('input-alert');
		this.element.find('.pass2').removeClass('input-alert');
		this.element.find('.notice-pass2').html('');
		this.element.find('.notice-pass2').removeClass('good-notice').removeClass('bad-notice');
		return true
	},
	update:function()
	{
		this.element.find('.title').html(Engine.lang.lines_editaccount);
		this.element.find('.email-msg').html(Engine.lang.field_email_msg);
		this.element.find('.lang-msg').html(Engine.lang.field_myacc_lang);
		this.element.find('.lang_pt_br').html(Engine.lang.field_lang_pt_br);
		this.element.find('.lang_en_us').html(Engine.lang.field_lang_en_us);
		this.element.find('.signature-msg').html(Engine.lang.field_signature);
		this.element.find('.pass1-label').html(Engine.lang.field_newpassword);
		this.element.find('.pass1-msg').html(Engine.lang.field_newpassword_msg);
		this.element.find('.pass2-label').html(Engine.lang.field_retypepassword);
		this.element.find('.pass2-msg').html(Engine.lang.field_retypepassword_msg);
		this.element.find('.savemodifications').html(Engine.lang.button_myacc_saveupdate);

		this.element.find('span.email').html(this.user.email);
		this.element.find('input.signature').val(this.user.signature);
		this.element.find('select.language').find('option[value='+this.user.lang+']').prop('selected',true);
		this.element.find('select.email_mytopics').find('option[value='+this.user.email_mytopics+']').prop('selected',true);
		this.element.find('select.email_mychannels').find('option[value='+this.user.email_mychannels+']').prop('selected',true);
		this.element.find('select.email_followedtopics').find('option[value='+this.user.email_followedtopics+']').prop('selected',true);
		this.element.find('select.email_followedchannels').find('option[value='+this.user.email_followedchannels+']').prop('selected',true);
		this.fieldSignatureCounter(0);

		this.imageedition = new ImageEdition({thi:this}, function(data, x1, x2, y1, y2)
		{
			data.thi.crop(data.index, x1, x2, y1, y2);
		});
		this.imageedition.setImageSrcFinal(this.user.avatar('big'));
		this.element.find('.avatar-edition').prepend(this.imageedition.getImageFinal());
		this.element.find('.avatar-edition .container').append(this.imageedition.getImageEdit());
		this.element.find('.avatar-edition input[type=file]').attr('id','file-avatar-'+this.user.id);
		this.element.find('.avatar-edition input.upload-avatar').clickOrEnter({thi:this},function(event)
		{
			event.data.thi.uploadTmpAvatar();
		});
		this.element.find('.hasavatar').val( this.user.hasavatar );
		if (this.user.hasavatar)
			this.element.find('.avatar_update_time').val(this.user.avatar_update_time);
	},
	uploadTmpAvatar: function()
	{
		this.controller.uploadTmpAvatar();
	},
	fieldPassword2Blur:function()
	{
		var password2 = this.element.find('.pass2').val();
		var password1 = this.element.find('.pass1').val();
		var notice = this.element.find('.notice-pass2');
		this.clearNotice(notice);
		if (password2.length>0 || password1.length>0)
		{
			if (!this.controller.checkPasswords())
			{
				notice.addClass('bad-notice');
				notice.html(Engine.lang.msg_incorrectretypepwd);
			} else {
				notice.addClass('good-notice');
				notice.html(Engine.lang.msg_itsok);
			}
		}
	},
	fieldSignatureKeyUp:function(event)
	{
		this.fieldSignatureCounter(event);
		while (this.signature_left<0)
		{
			this.element.find('input.signature').val( this.element.find('input.signature').val().substr(0,100) );
			this.fieldSignatureCounter(event);
		}
	},
	fieldSignatureCounter:function(event)
	{
		var signature = this.element.find('input.signature').val();
		this.signature_left = 100-signature.length;
		this.element.find('.signature-counter').html(this.signature_left+' '+Engine.lang.label_charleft);
	},
	getElement: function()
	{
		return this.element;
	},
	getSignature: function()
	{
		return this.element.find('input.signature').val();
	},
	getPassword: function()
	{
		return this.element.find('.pass1').val();
	},
	getPassword2: function()
	{
		return this.element.find('.pass2').val();
	},
	getLanguage: function()
	{
		return this.element.find('select.language option:selected').val();
	},
	getEmailMyTopics: function()
	{
		return this.element.find('select.email_mytopics option:selected').val();
	},
	getEmailFollowedTopics: function()
	{
		return this.element.find('select.email_followedtopics option:selected').val();
	},
	getEmailMyChannels: function()
	{
		return this.element.find('select.email_mychannels option:selected').val();
	},
	getEmailFollowedChannels: function()
	{
		return this.element.find('select.email_followedchannels option:selected').val();
	},
	clearNotice:function(elem)
	{
		elem.removeClass('notsogood-notice').removeClass('good-notice').removeClass('bad-notice');
		elem.html('');
	}
});


var ChannelAdminPage = Class.extend({

	init: function(controller, channels, channelid)
	{
		this.imageeditions = new Array(channels.length);
		this.descriptionboxes = new Array(channels.length);
		this.tables = new Array(channels.length);
		this.controller = controller;
		this.channels = channels;
		this.element = Mailman.getTemplate('channel-admin');
		this.table2clone = this.element.find('div.channel-admin').clone();
		this.imgfileinput2clone = this.element.find('input.file').clone();
		this.element.find('div.channel-admin').remove();
		this.tabs = this.element.find('.channel-tabs');
		this.tab2clone = this.tabs.children().first().clone();
		this.tabs.children().first().remove();
		this.build();
		if (channelid!=null)
			this.selectTab(channelid);
	},
	getChannel: function()
	{
		var children = this.element.find('.channel-tabs').children();
		for (var i = 0; i < children.length; i++)
		{
			if (jQuery(children[i]).hasClass('selected'))
				return this.channels[i];
		}
		return null;
	},
	getDescription: function()
	{
		var children = this.element.find('.channel-admin');
		for (var i = 0; i < children.length; i++)
			if (jQuery(children[i]).hasClass('selected'))
				return this.descriptionboxes[i].getDescription();
	},
	getHaslogo:function()
	{
		var t = this.element.find('.channel-admin').filter('.selected');
		return t.find('.haslogo').val();
	},
	getLogoUpdateTime:function()
	{
		var t = this.element.find('.channel-admin').filter('.selected');
		return t.find('.logo_update_time').val();
	},
	getIndexSelected: function()
	{
		var children = this.element.find('.channel-admin');
		for (var i = 0; i < children.length; i++)
			if (jQuery(children[i]).hasClass('selected'))
				return i;
	},
	getLanguage: function()
	{
		return 'pt_br';
		//return this.element.find('.channel-admin').filter('.selected').find(
	},
	getPermMember: function()
	{
		var t = this.element.find('.channel-admin').filter('.selected');
		for (var i = 3; i >= 0; i--)
			if (t.find('input[name=member'+i+']').is(':checked'))
				return i;
	},
	getPermReguser: function()
	{
		var t = this.element.find('.channel-admin').filter('.selected');
		for (var i = 3; i >= 0; i--)
			if (t.find('input[name=user'+i+']').is(':checked'))
				return i;
	},
	getPermAnon: function()
	{
		var t = this.element.find('.channel-admin').filter('.selected');
		for (var i = 3; i >= 0; i--)
			if (t.find('input[name=anon'+i+']').is(':checked'))
				return i;
	},
	getAskToFollow: function()
	{
		return this.element.find('.channel-admin').filter('.selected').find('input[name=asktofollow]').is(':checked');
	},
	getTable: function()
	{
		return this.tables[this.getIndexSelected()];
	},
	cancelTmpLogo: function()
	{
		this.updateImgButtons(this.getTable(), this.getChannel().id);
	},
	uploadTmpLogo: function()
	{
		this.controller.uploadTmpLogo();
	},
	getFileElementId: function()
	{
		return 'file-logo-'+this.channels[this.getIndexSelected()].id;
	},
	build: function()
	{
		this.element.find('div.channel-tab').remove();
		this.element.find('div.channel-admin').remove();
		for (var i = 0; i < this.channels.length; i++)
		{
			var channel = this.channels[i];
			this.descriptionboxes[i] = new ChannelDescription(channel.description);


			var addthis_config = {"data_track_clickback":true};
			var addthis_share =
			{
				url:'http://rapidcoffee.com/channel/'+channel.urlname,
				title:channel.name,
				description:channel.description,
				templates: {
					twitter: Engine.lang.msg_chadm_twitter
				},
				email_template:'channel_template'
			};
			var tab = this.tab2clone.clone();
			tab.addClass('cid-'+channel.id);
			tab.html(channel.name);
			tab.unbind('click').click({thi:this}, function(event)
			{
				event.data.thi.selectTab(jQuery(this).attr('class').match(/cid-(\d+)/)[1]);
			});
			this.tabs.append(tab);

			var table = this.table2clone.clone();
			table.addClass('cid-'+channel.id);

			table.find('.logo-label').html(Engine.lang.field_chadm_logo);
			table.find('.logo-msg').html(Engine.lang.field_chadm_logo_msg);
			table.find('.share-label').html(Engine.lang.field_chadm_share);
			//table.find('.share_msg').html(Engine.lang.field_chadm_share_msg);
			table.find('.channel-description').html(Engine.lang.field_chadm_description);
			table.find('.channel-description-msg').html(Engine.lang.field_chadm_description_msg);
			table.find('.url-label').html(Engine.lang.field_chadm_url);
			table.find('.permissions-label').html(Engine.lang.field_chadm_permissions);
			table.find('.permissions-msg').html(Engine.lang.field_chadm_permissions_msg);
			table.find('.member').html(Engine.lang.field_chadm_member);
			table.find('.reguser').html(Engine.lang.field_chadm_reguser);
			table.find('.anon').html(Engine.lang.field_chadm_anon);
			table.find('.asktofollow').html(Engine.lang.field_chadm_asktofollow);
			table.find('.createtopic').html(Engine.lang.field_chadm_createtopic);
			table.find('.createpost').html(Engine.lang.field_chadm_createpost);
			table.find('.readchannel').html(Engine.lang.field_chadm_readchannel);
			table.find('.nothing').html(Engine.lang.field_chadm_nothing);
			table.find('.button_save').html(Engine.lang.button_chadm_saveupdate);
			table.find('.button_cancel').html(Engine.lang.button_chadm_cancelupdate);

			table.find('.url').html("http://rapidcoffee.com/channel/"+channel.urlname);

			this.imageeditions[i] = new ImageEdition({index:i, thi:this}, function(data, x1, x2, y1, y2)
			{
				data.thi.crop(data.index, x1, x2, y1, y2);
			});
			this.imageeditions[i].setImageSrcFinal(channel.logo('big'));
			table.find('.logo-edition').prepend(this.imageeditions[i].getImageFinal());
			table.find('.logo-edition .container').append(this.imageeditions[i].getImageEdit());

			this.updateImgButtons(table, channel.id);

			table.find('.haslogo').val( channel.haslogo );
			if (channel.haslogo)
				table.find('.logo_update_time').val(channel.logo_update_time);

			var perms = table.find('.permissions-table input');
			for (var j = 0; j < perms.length; j++)
			{
				jQuery(perms[j]).unbind().clickOrEnter({thi:this},function(event)
				{
					event.data.thi.clickOrEnterPermission(event);
				});
			}
			for (var j = 0; j < 4; j++)
			{
				if (channel.perm_member>=j)
					table.find('input[name=member'+j+']').attr('checked',true);
				if (channel.perm_reguser>=j)
					table.find('input[name=user'+j+']').attr('checked',true);
				if (channel.perm_anon>=j)
					table.find('input[name=anon'+j+']').attr('checked',true);
			}
			if (channel.asktofollow)
				table.find('input[name=asktofollow]').attr('checked',true);
			table.find('div.channel-description').html('');
			table.find('div.channel-description').append(this.descriptionboxes[i].getTextarea());
			table.find('div.description-counter').html('');
			table.find('div.description-counter').append(this.descriptionboxes[i].getCounter());
			table.find('div.big-btn-green').click({thi:this},function(event)
			{
				event.data.thi.controller.saveChanges();
			});
			table.find('div.big-btn-gray').click({thi:this},function(event)
			{
				var channel = event.data.thi.getChannel();
				event.data.thi.controller.cancelChanges();
				event.data.thi.selectTab(channel.id);
			});
			this.tables[i] = table;
			this.element.append(table);
			try {
				var tool = table.find('.addthis_toolbox');
				addthis.toolbox(tool.get(0), addthis_config, addthis_share);
			} catch(e) { console.log('no addthis this time.'); }
		}
		Engine.getThe().initBigButtons();
	},
	updateLogo: function()
	{
		var index = this.getIndexSelected();
		this.imageeditions[index].setImageSrcFinal(this.channels[index].logo('big'));
	},
	crop: function(index, x1, x2, y1, y2)
	{
		this.controller.crop(this.imageeditions[index].getFilename(), this.channels[index].id, x1, x2, y1, y2);
	},
	updateImgButtons: function(table, cid)
	{
		table.find('.logo-edition > div.buttons').find('input.file').remove();
		table.find('.logo-edition > div.buttons').prepend(this.imgfileinput2clone.clone());
		table.find('.logo-edition > div.buttons input[type=file]').attr('id','file-logo-'+cid);
		table.find('.logo-edition > div.buttons input.upload-logo').unbind().clickOrEnter({thi:this},function(event)
		{
			event.data.thi.uploadTmpLogo();
		});
		table.find('.logo-edition > div.buttons input.cancel-logo').unbind().clickOrEnter({thi:this},function(event)
		{
			event.data.thi.cancelTmpLogo();
		});
	},
	selectTab: function(cid)
	{
		var tabs = this.element.find('.channel-tabs').children();
		var tables = this.element.find('.channel-admin');
	
		tabs.not('.cid-'+cid).each(function()
		{
			jQuery(this).removeClass('selected');
			jQuery(this).addClass('non-selected');
		});
		tables.not('.cid-'+cid).each(function()
		{
			jQuery(this).removeClass('selected');
			jQuery(this).addClass('non-selected');
		});
		tabs.filter('.cid-'+cid).removeClass('non-selected');
		tabs.filter('.cid-'+cid).addClass('selected');
		tables.filter('.cid-'+cid).removeClass('non-selected');
		tables.filter('.cid-'+cid).addClass('selected');
	},
	showLogoEdition:function(filename)
	{
		this.filename = filename;
		this.imageeditions[this.getIndexSelected()].showEditionPanel(filename);
	},
	clickOrEnterPermission: function(event)
	{
		var td = jQuery(event.currentTarget).parent();
		if (!td.find('input').is(':checked'))
		{
			td.find('input').attr('checked',false);
			td = td.prev();
			while (td[0].nodeName.toLowerCase()=='td')
			{
				td.find('input').attr('checked',false);
				td = td.prev();
			}
		} else {
			td.find('input').attr('checked',true);
			td = td.next();
			while (td.length>0)
			{
				td.find('input').attr('checked',true);
				td = td.next();
			}
		}
	},
	getElement: function() { return this.element; },
	setLoading: function()
	{
		this.element.find('.load-icon-small').css('visibility','visible');
	},
	unsetLoading: function()
	{
		this.element.find('.load-icon-small').css('visibility','hidden');
	}

});


var ChannelDescription = Class.extend({

	init: function(description)
	{
		var t = Mailman.getTemplate('channel-description');
		t.find('.counter').html(Engine.lang.field_chadm_counter);
		this.textarea = t.find('textarea');		
		this.setDescription(description);
		this.counter = t.find('.channel-description-counter');
		this.counter.hide();
		this.counter.find('span.number').html(CONF['channel_desc_length'] - description.length);
		this.textarea.keydown({thi:this},function(event)
		{
			return event.data.thi.fieldDescriptionKeyDown(event);
		});
		this.textarea.keyup({thi:this},function(event)
		{
			return event.data.thi.fieldDescriptionKeyUp(event);
		});
		this.textarea.focus({thi:this},function(event)
		{
			return event.data.thi.fieldDescriptionFocus(event);
		});
		this.textarea.blur({thi:this},function(event)
		{
			return event.data.thi.fieldDescriptionBlur(event);
		});
	},
	setDescription: function(msg)
	{
		this.textarea.val(msg);
	},
	getDescription: function()
	{
		return this.textarea.val();
	},
	getTextarea: function() { return this.textarea },
	getCounter: function() { return this.counter },
	fieldDescriptionKeyDown:function(event)
	{
		if (check_keycode_enter(event.keyCode))
			return false;
		if (check_keycode_doesnt_produce_char(event.keyCode))
			return true;

		var description = this.textarea.val();

		if (description.length>=CONF['channel_desc_length'])
			return false;
		return true;
	},
	fieldDescriptionKeyUp:function(event)
	{
		var description = this.textarea.val();

		if (description.length > CONF['channel_desc_length'])
		{
			description = description.substr(0,CONF['channel_desc_length']);
			this.textarea.val(description);
		}
		this.counter.find('span.number').html(CONF['channel_desc_length'] - description.length);

		return true;
	},
	fieldDescriptionFocus:function(event)
	{
		var description = this.textarea.val();
		description = this.clearDescription(description);
		this.textarea.val(description);
		this.counter.fadeIn();
		return true;
	},
	fieldDescriptionBlur:function(event)
	{
		var description = this.textarea.val();
		description = this.clearDescription(description);
		this.textarea.val(description);
		if (description.length>CONF['channel_desc_length'])
		{
			description = description.substr(0,CONF['channel_desc_length']);
			this.textarea.val( description );
		}
		this.counter.find('span.number').html(CONF['channel_desc_length'] - description.length);
		this.counter.fadeOut();
		return true;
	},
	clearDescription:function(description)
	{
		if (description.match(/[\r\t]/i))
			description = description.replace(/[\r\t]/gi,'');
		if (description.match(/  +/))
			description = description.replace(/  +/g,' ') ;
		description = description.replace(/(\r|\n)/g,'');
		return jQuery.trim(description);
	}
});

var ImageEdition = Class.extend({

	init:function(data, cropCallback)
	{
		this.cropCallback = cropCallback;
		this.cropCallbackData = data;

		jQuery.getScript('js/prototype.1.7.0.0.js', function()
		{
			jQuery.getScript('js/scriptaculous.js', function()
			{
				jQuery.getScript('js/effects.js', function()
				{
					jQuery.getScript('js/dragdrop.js', function()
					{
						jQuery.getScript('js/cropper.js');
					});
				});
			});
		});
		addcss('css/cropper.css', {thi:this}, function(data)
		{
			data.thi.finalizeInit();
		});
	},
	finalizeInit: function()
	{
		var image_template = Mailman.getTemplate('image-edit');
		this.image_final = image_template.find('.image-final');
		this.image_edit = image_template.find('.image-edit');
		this.image_edit.hide();
		var r = Math.floor(Math.random()*10000);
		this.image_edit.attr('id','image-final-'+r);
		this.image_edit.find('img').attr('id','image-final-img-'+r);
		this.img_edit_backup = this.image_edit.find('img');
		this.image_edit.find('input.button-bad').clickOrEnter({thi:this},function(event)
		{
			event.data.thi.closeEdition();
		});
		this.image_edit.find('input.button-good').clickOrEnter({thi:this},function(event)
		{
			event.data.thi.crop();
		});
	},
	crop: function()
	{
		this.cropCallback(this.cropCallbackData, this.x1, this.x2, this.y1, this.y2);
		this.closeEdition();
	},
	setCropCoords: function(x1, x2, y1, y2)
	{
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
	},
	initCrop: function()
	{
		var closure = (function(thi)
		{
			return function()
			{
				var endcrop = (function(thi)
				{
					return function(coords, dimensions)
					{
						thi.setCropCoords(coords.x1, coords.x2, coords.y1, coords.y2);
					};
				})(thi);
				thi.cropper = new Cropper.Img(thi.getImageEditImgId(),
				{
			                ratioDim: { x:1, y:1 },
					displayOnInit: true,
			                minWidth: 50,
			                minHeight: 50,
					onEndCrop: endcrop
				});
			};
		})(this);
		setTimeout(closure,500);
	},
	closeEdition: function()
	{
		this.cropper.remove();
		this.image_edit.hide();
		jQuery(this.image_edit.children()[0]).html('').append(this.img_edit_backup);
	},
	getImageFinalId:function()
	{
		return this.image_final.attr('id');
	},
	getImageEditId:function()
	{
		return this.image_edit.attr('id');
	},
	getImageFinalImgId:function()
	{
		return this.image_final.find('img').attr('id');
	},
	getImageEditImgId:function()
	{
		return this.image_edit.find('img').attr('id');
	},
	getImageFinal:function()
	{
		return this.image_final;
	},
	getImageEdit:function()
	{
		return this.image_edit;
	},
	setImageSrcFinal:function(src)
	{
		this.image_final.find('img').attr('src',src);
	},
	setImageSrcEdit:function(src)
	{
		this.image_edit.find('img').attr('src',src);
	},
	showEditionPanel:function(src)
	{
		this.filename = src;
		new Draggable(this.getImageEditId());
		this.image_edit.find('img').attr('src',src);
		this.image_edit.show();
		this.image_edit.find('img').load({thi:this},function(event)
		{
			event.data.thi.initCrop();
		});
	},
	getFilename:function() { return this.filename; }
});

var SimpleNotice = Class.extend({

	init: function(title, msg)
	{
		this.id = Math.floor(Math.random()*10000);
		this.inputlabels = new Array();
		this.inputvalues = new Array();
		this.zindex = 10000;
		this.title = 'empty';
		if (!msg)
			this.msg = 'empty';
		else if (title)
		{
			this.title = title;
			this.msg = msg;
			this.show();
		} else
		this.width = null;
	},
	setWidth:function(width)
	{
		this.width = width;
	},
	setTitle:function(title)
	{
		this.title = title;
	},
	setMsg:function(msg)
	{
		this.msg = msg;
	},
	getId: function()
	{
		return this.element.attr('id');
	},
	show: function(resume)
	{
		this.resume = resume;

		if (this.inputlabels.length > 0)
			this.element = Mailman.getTemplate('simple-notice-with-input');
		else
			this.element = Mailman.getTemplate('simple-notice');
		this.element.attr('id',this.id);

		jQuery('body').append(this.element);

		if (this.width)
			this.element.width(this.width);

		this.element.prop('title',this.title);
		this.element.dialog({width:250,resizable:false});

		this.element.find('.msg').html(this.msg);
		var maxwidth = 0;
		for (var i = 0; i < this.inputlabels.length; i++)
		{
			var label = jQuery("<label>"+this.inputlabels[i]+"</label>");
			var input = jQuery("<input type='text' class='text' />");
			input.addClass("id-"+i);
			this.element.find('.inputs').append(label).append(input);
		}

		var labels = this.element.find('.inputs label');
		for (var i = 0; i < labels.length; i++)
		{
			if (maxwidth < jQuery(labels[i]).width())
				maxwidth = jQuery(labels[i]).width()
		}
		this.element.find('input.text').width(this.element.width() - maxwidth - 20);

		
		if (this.inputlabels.length > 0)
		{
			var handler = function(event)
			{
				event.data.thi.ok();
			}
			this.element.find('input.button-good').unbind('click').unbind('keypress').clickOrEnter({thi:this},handler);
			this.element.find('input.text').enter({thi:this},handler);
			this.element.find('input.button-bad').unbind('click').unbind('keypress').clickOrEnter({thi:this},function(event)
			{
				event.data.thi.cancel();
				event.data.thi.destroy();
			});
			this.element.find('input.id-0').focus();
		} else {
			this.element.find('input.button-good').unbind('click').unbind('keypress').clickOrEnter({thi:this},function(event)
			{
				event.data.thi.destroy();
				return true;
			});
			this.element.find('input.button-good').focus();
		}

		if (this.zindex)
			this.element.css('z-index',this.zindex);
	},
	hide: function()
	{
		this.element.hide();
	},
	destroy: function()
	{
		this.element.dialog('close').remove();
		if (this.resume)
			this.resume();
	},
	addInputLabel: function(label)
	{
		this.inputlabels.push(label);
	},
	getInputValue: function(which)
	{
		return this.inputvalues[which-1];
	},
	ok:function()
	{
		for (var i = 0; i < this.inputlabels.length; i++)
			this.inputvalues[i] = this.element.find('input.id-'+i).val();
		if (this.okCallback)
			this.okCallback();
	},
	setOkCallback:function(callback){
		this.okCallback=callback;
	},
	cancel:function()
	{
		for (var i = 0; i < this.inputlabels.length; i++)
			this.inputvalues[i] = null;
	},
	setLoading:function()
	{
		this.element.find('.load-icon-small').css('visibility','visible');
	},
	unsetLoading:function()
	{
		this.element.find('.load-icon-small').css('visibility','hidden');
	}
});


var FastNotice = Class.extend({

	init: function(msg)
	{
		this.element = Mailman.getTemplate('fast-notice');
		if (msg==null)
			this.msg = 'empty';
		else
		{
			this.msg = msg;
			this.show();
		}
	},
	show:function()
	{
		this.element.html(this.msg);
		jQuery('body').append(this.element);

		var handler = (function(thi)
		{
			return function()
			{
				var handler2 = (function(th)
				{

					return function()
					{
						var handler3 = (function(t)
						{
							return function()
							{
								t.element.remove();
							}
						})(th);
						th.element.fadeOut('slow',handler3);
					}
				})(thi);
				setTimeout(handler2,3500);
			}
		})(this);
		this.element.fadeIn('slow',handler);
	}
});

var WelcomePage = Class.extend({

	init: function(controller)
	{
		this.controller = controller;
		if (document.createStyleSheet)
			document.createStyleSheet('css/welcome.css');
		else
		{
			this.link = jQuery("<link rel='stylesheet' type='text/css' href='css/welcome.css' />");
			jQuery('head').append(this.link);
		}

		if (jQuery.browser.msie)
			if (jQuery.browser.version=='7.0')
				document.createStyleSheet('css/wie7.css');

		this.element = jQuery('#welcome');
		var closure = (function(thi)
		{
			return function()
			{
				thi.finalizeInit();
			};
		})(this);
		this.element.load('welcome.php', closure);
	},
	finalizeInit: function()
	{
		this.element.find('#wcongratulations-2').hide();
		this.recentuserli = this.element.find('.wnewusers ol li').clone();
		this.element.find('.wnewusers ol li').remove();
		this.element.find('.wclose').click(function()
		{
			Engine.destroyWelcomePage();
		});
		this.element.expose({color:'#111',closeOnEsc: false, closeOnClick: false});
		this.element.find('table input.wbutton').clickOrEnter({thi:this}, function(event)
		{
			event.data.thi.submit();
		});
		activate_input_placeholder(this.element.find('table input.wnickname'));
		activate_input_placeholder(this.element.find('table input.wemail'));
		this.element.find('table input.wtext').enter({thi:this}, function(event)
		{
			event.data.thi.submit();
		});
		var ipass = this.element.find('table input.wpassword');
		ipass.enter({thi:this}, function(event)
		{
			event.data.thi.submit();
		});
		activate_input_placeholder(ipass);
		this.element.find('.wsignin-sec .wbutton').clickOrEnter({thi:this},function(event)
		{
			event.data.thi.controller.signin();
		});
		var nickoremail = this.element.find('.wsignin-sec input.wtext');
		activate_input_placeholder(nickoremail);
		nickoremail.enter({thi:this},function(event)
		{
			event.data.thi.controller.signin();
		});
		var pass = this.element.find('.wsignin-sec input.wpassword');
		activate_input_placeholder(pass);
		pass.enter({thi:this},function(event)
		{
			event.data.thi.controller.signin();
		});
		this.element.find('.wsignin-sec .wforgot a').click({thi:this},function(event)
		{
			new ForgotPassword();
			return false;
		});
		this.element.find('input.wnickname').blur({thi:this},function(event){
			event.data.thi.setNickname(clearNickname(event.data.thi.getNickname()));
		});
	},
	getSigninNickEmail:function()
	{
		return this.element.find('.wsignin-sec .wsigin-nickemail').val();
	},
	getSigninPassword:function()
	{
		return this.element.find('.wsignin-sec .wsigin-password').val();
	},
	getStaySignedin:function()
	{
		var t = this.element.find('.wsignin-sec input[name=wstaysignedin]:checked');
		return t.length !== 0;
	},
	emptySigninPassword: function()
	{
		this.element.find('.wsignin-sec .wpassword').css('background-color','#ffaaaa !important');
		this.element.find('.wsignin-sec .wpassword').focus();
	},
	emptySigninNickEmail: function()
	{
		this.element.find('.wsignin-sec .wsigin-nickemail').css('background-color','#ffaaaa !important');
		this.element.find('.wsignin-sec .wsigin-nickemail').focus();
	},
	emptyPassword: function()
	{
		this.element.find('table .password-wnotice').html('Senha vazia.');
	},
	emptyEmail: function()
	{
		this.element.find('table .email-wnotice').html('E-mail vazio.');
	},
	eraseMessages: function()
	{
		this.element.find('table .nickname-wnotice').html('');
		this.element.find('table .email-wnotice').html('');
		this.element.find('table .password-wnotice').html('');
	},
	emptyNickname: function()
	{
		this.element.find('table .nickname-wnotice').html('Nickname vazio.');
	},
	invalidEmail: function()
	{
		this.element.find('table .email-wnotice').html('E-mail inválido.');
	},
	emailAlreadyInUse: function(){
		this.element.find('table .email-wnotice').html('E-mail já está em uso.');
	},
	nicknameAlreadyInUse: function(){ 
		this.element.find('table .nickname-wnotice').html('Nickname já está em uso.');
	},
	submit: function()
	{
		this.controller.submit();
	},
	getNickname: function()
	{
		return this.element.find('table .wnickname').val();
	},
	setNickname: function(param)
	{
		this.element.find('table .wnickname').val(param);
	},
	getEmail: function()
	{
		return this.element.find('table .wemail').val();
	},
	getPassword: function()
	{
		return this.element.find('table .wpassword').val();
	},
	show: function()
	{

	},
	destroy: function()
	{
		jQuery.mask.close();
		if (this.link)
			this.link.remove();
		this.element.html('');
	},
	showCongratulations: function(nick, pass)
	{
		this.element.find('*').unbind();
		this.element.find('input.wtext').prop('disabled',true);
		this.element.find('input.wpassword').prop('disabled',true);
		this.element.find('input.wbutton').unbind();
		jQuery.scrollTo(0, 1000);
		if (jQuery('#fromid').length>0)
		{
			var e = this.element.find('.welcome-wrap .wcongratulations');
			e.find('input').prop('disabled',false);
			var fromid = jQuery('#fromid').html();

			Mailman.getFrom(fromid, {fromid:fromid,nick:nick,pass:pass,e:e,thi:this}, function(from, data)
			{
				var e = data.e; var nick = data.nick; var pass = data.pass;
				e.html( e.html().replace('XNICKX', nick) );
				e.find('span.from').html(from.question);
				e.css('z-index',10000);
				e.show();
				e.focus();
				jQuery.scrollTo(0, 1000);
				e.find('.wcon-button').click({fromid:data.fromid,thi:data.thi,nick:nick,pass:pass},function(event)
				{
					var v = jQuery(this).parent().find("input[name='from']:checked").val();
					if (v=='y')
						Mailman.setUserFrom(event.data.nick, event.data.pass, event.data.fromid)
					event.data.thi.continueSignedIn(event.data.nick, event.data.pass);
				});
			});

		} else {

			var e = this.element.find('#wcongratulations-2');
			e.html( e.html().replace('XNICKX', nick) );
			jQuery('#wcongratulations-2').fadeIn();
			var closure = (function(thi, nick, pass)
			{
				return function()
				{
					thi.continueSignedIn(nick, pass);
				};
			})(this, nick, pass);
			setTimeout(closure, 2000);
		}
	},
	continueSignedIn: function(nick, pass)
	{
		this.controller.continueSignedIn(nick, pass);
	},
	prependUser: function(user, animate)
	{
		var li = this.recentuserli.clone();
		li.find('.wnicknameli').html(user.get('nickname'));
		li.find('.wfrom').html(user.get('camefrom'));
		li.find('.wago').html(user.get('timeago'));
		if (animate)
		{
			li.find('.wbox').hide();
			this.element.find('.wnewusers ol').prepend(li);
			li.find('.wbox').slideDown(2000);
		} else
			this.element.find('.wnewusers ol').prepend(li);

		if (this.element.find('.wnewusers ol li').length>10)
		{
			var closure = (function(thi)
			{
				return function()
				{
					thi.element.find('.wnewusers ol li').last().remove();
				};
			})(this);
			setTimeout(closure,3000);
		}
	},
	setSigninLoading: function()
	{
		this.element.find('.wsignin-sec .load-horiz-icon').css('visibility','visible');
	},
	unsetSigninLoading: function()
	{
		this.element.find('.wsignin-sec .load-horiz-icon').css('visibility','hidden');
	},
	setLoading: function()
	{
		this.element.find('table .load-horiz-icon').css('visibility','visible');
	},
	unsetLoading: function()
	{
		this.element.find('table .load-horiz-icon').css('visibility','hidden');
	}
});

var OfferChannelsSection = Class.extend({

	init: function(controller)
	{
		this.controller = controller;
		addcss('css/offer-channels.css', {thi:this}, function(data)
		{
			data.thi.finalizeInit();
		});
	},
	finalizeInit: function()
	{
		this.element = Mailman.getTemplate('offer-channels');
		this.element.appendTo('#window1-wrap');
		this.element.parent().expose({color:'#111',closeOnEsc: false, closeOnClick: false});
		this.li = this.element.find('div.window1-channel').clone();
		this.element.find('div.window1-channel').remove();
		this.element.find('input.button-good').click({thi:this}, function(event)
		{
			event.data.thi.controller.subscribeAndContinue();
		});
		this.element.find('input.button-bad').click({thi:this}, function(event)
		{
			event.data.thi.controller.cancelAndContinue();
		});
		this.controller.finalizeInit();
		jQuery.scrollTo(0, 1000);
	},
	destroy: function()
	{
		jQuery.mask.close();
		this.element.remove();
	},
	prependChannel: function(channel)
	{
		var li = this.li.clone();
		li.find('.window1-channel-title').html(channel.get('name'));
		li.find('.window1-channel-logo img').attr('src',channel.logo('med'));
		li.find('.window1-channel-desc').html(channel.get('description'));
		li.addClass('cid-'+channel.get('id'));
		this.element.find('.window1-content').prepend(li);
		li.click({thi:this}, function(event)
		{
			var yes = /window1-sub-channel-yes/;
			var cid = jQuery(this).attr('class').match(/cid-(\d+)/)[1];

			if (yes.test(jQuery(this).attr('class')))
			{
				jQuery(this).removeClass('window1-sub-channel-yes');
				jQuery(this).addClass('window1-sub-channel-no');
				jQuery(this).find('.window1-check-icon img').fadeOut('fast');
				event.data.thi.controller.subscribe(cid, false);
			} else {
				jQuery(this).removeClass('window1-sub-channel-no');
				jQuery(this).addClass('window1-sub-channel-yes');
				jQuery(this).find('.window1-check-icon img').fadeIn('fast');
				event.data.thi.controller.subscribe(cid, true);
			}
		});
	},
	setLoading: function()
	{
		this.element.find('.load-icon-small').css('visibility','visible');
	},
	unsetLoading: function()
	{
		this.element.find('.load-icon-small').css('visibility','hidden');
	}

});

var FirstTabTip = Class.extend({

	init: function()
	{
		this.tip = jQuery('#tip-first-tab');
		this.tip.slideDown();
		this.tip.find('input.tip-button-good').click({thi:this}, function(event)
		{
			event.data.thi.destroy();
		});
		this.tip.find('input.tip-button-bad').click({thi:this}, function(event)
		{
			Engine.stopTour();
			event.data.thi.destroy();
		});
	},
	destroy: function()
	{
		this.tip.find('*').unbind();
		this.tip.slideUp();
	}
});

var ChannelTip = Class.extend({

	init: function(element, channel)
	{
		this.tip = element.find('.channel-tip-tour');
		var t = this.tip.find('div.text');
		t.html( t.html().replace('XCHANNELX', channel.get('name')) );
		this.tip.slideDown(function()
		{
			jQuery(this).show();
		});
		this.tip.find('input.tip-button-good').click({thi:this}, function(event)
		{
			event.data.thi.destroy();
		});
		this.tip.find('input.tip-button-bad').click({thi:this}, function(event)
		{
			Engine.stopTour();
			event.data.thi.destroy();
		});
	},
	destroy: function()
	{
		this.tip.find('*').unbind();
		this.tip.slideUp(function()
		{
			jQuery(this).hide()
		});
	}
});


var LikeDislikeView = Class.extend({

	init:function(element, topicorpost)
	{
		this.element = element;
		this.topicorpost = topicorpost;

		this.likes = this.element.find('.likes');
		this.dislikes = this.element.find('.dislikes');

		this.cg = this.element.find('.cg');
		this.cr = this.element.find('.cr');

		this.likes.find('span').html(Engine.lang.field_likes);
		this.dislikes.find('span').html(Engine.lang.field_dislikes);

		this.likes.click({topicorpost:topicorpost}, function(event)
		{
			var topicorpost = event.data.topicorpost;
			if (topicorpost.ldvote!='none')
				new SimpleNotice('Alerta', Engine.lang.msg_youhavealreadyvoted);
			else {
				var elem = jQuery(this);
				elem.find('span').css('visibility','hidden');
				elem.find('.load-like-dislike').css('visibility','visible');

				topicorpost.like({elem:elem}, function(r, data)
				{
					data.elem.find('span').css('visibility','visible').html(Engine.lang.field_likes);
					data.elem.find('.load-like-dislike').css('visibility','hidden');
					new FastNotice(Engine.lang.msg_likedtopic);
					Engine.updateLikes();

				}, function(r, data)
				{
					data.elem.find('span').css('visibility','visible').html(Engine.lang.field_likes);
					data.elem.find('.load-like-dislike').css('visibility','hidden');
					new SimpleNotice('Alerta', beautify_error(r.error));
				});
			}
		});
		this.dislikes.click({topicorpost:topicorpost}, function(event)
		{
			var topicorpost = event.data.topicorpost;
			if (topicorpost.ldvote!='none')
				new SimpleNotice('Alerta', Engine.lang.msg_youhavealreadyvoted);
			else {
				var elem = jQuery(this);
				elem.find('span').css('visibility','hidden');
				elem.find('.load-like-dislike').css('visibility','visible');

				topicorpost.dislike({elem:elem}, function(r, data)
				{
					data.elem.find('span').css('visibility','visible').html(Engine.lang.field_dislikes);
					data.elem.find('.load-like-dislike').css('visibility','hidden');
					new FastNotice(Engine.lang.msg_dislikedtopic);
					Engine.updateLikes();

				}, function(r, data)
				{
					data.elem.find('span').css('visibility','visible').html(Engine.lang.field_dislikes);
					data.elem.find('.load-like-dislike').css('visibility','hidden');
					new SimpleNotice('Alerta', beautify_error(r.error));
				});
			}
		});
	},
	setLikes:function(n)
	{
		this.cg.html(n);
	},
	setDislikes:function(n)
	{
		this.cr.html(n);
	},
	update:function()
	{
		if (this.topicorpost.ldvote==='liked')
		{
			this.likes.attr('class','likes votted liked');
			this.dislikes.attr('class','dislikes votted');

		} else 	if (this.topicorpost.ldvote=='disliked')
		{
			this.likes.attr('class','likes votted');
			this.dislikes.attr('class','dislikes votted disliked');
		} else
		{
			this.likes.attr('class','likes likes_not_votted');
			this.dislikes.attr('class','dislikes dislikes_not_votted');
		}
	}
});

var PublicUserPageView = Class.extend({

	init:function(user)
	{
		this.user = user;
		this.element = Mailman.getTemplate('publicuserpage');
		this.update();
	},
	update:function()
	{
		this.element.find('.avatar-big').attr('src',this.user.avatar('big'));
		this.element.find('.nickname .right').html(this.user.get('nickname'));
		this.element.find('.level .right').html(this.user.get('level'));
		this.element.find('.reputation .right').html(this.user.get('reputation'));
		this.element.find('.sex .right').html(this.user.get('sex'));
		this.element.find('.yearsold .right').html(this.user.get('yearsold'));
		this.element.find('.nposts .right').html(this.user.get('nposts'));
		this.element.find('.ntopics .right').html(this.user.get('ntopics'));
		this.element.find('.regdate .right').html(this.user.get('regdate'));
		this.element.find('.homepage .right').html(this.user.get('homepage'));
		this.element.find('.msn .right').html(this.user.get('msn'));
		this.element.find('.gtalk .right').html(this.user.get('gtalk'));
		this.element.find('.facebook .right').html(this.user.get('facebook'));
		this.element.find('.orkut .right').html(this.user.get('orkut'));
	},
	getElement:function() { return this.element; },
	destroy:function() {}
});
