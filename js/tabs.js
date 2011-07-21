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
var Tab = Class.extend({

	init:function(tabn, tabs, hash)
	{
		this.hash = hash;
		this.tabn = tabn;
		this.tabs = tabs;
		this.onbeforeclose = function(){};
		this.onafterclose = function(){};
		this.onbeforeselect = function(){};
		this.onafterselect = function(){};
		this.onbeforeunselect = function(){};
		this.onafterunselect = function(){};
		this.banner = new Banner();
	},
	getHash:function() { return this.hash; },
	select:function(real)
	{
		if (!real && this.tabs.ontabselect)
		{
			this.tabs.ontabselect(this);
			return;
		}
		if (this.isSelected())
			return;

		this.banner.show();
		this.onbeforeselect(this.onbeforeselectdata);
		this.tabs.select(this.tabn);
		this.onafterselect(this.onafterselectdata);
	},
	dobeforeunselect:function()
	{
		this.onbeforeunselect(this.onbeforeunselectdata);
	},
	doafterunselect:function()
	{
		this.onafterunselect(this.onafterunselectdata);
		this.banner.hide();
	},
	isSelected:function()
	{
		return this.tabs.isSelected(this.tabn);
	},
	highlight:function()
	{
		var id = this.tabs.idprefix+'-item-'+this.tabn;
		var t = jQuery('#'+id);
		var v = t.css('-webkit-transition');
		if (v)
		{
			var closure = (function(id,value)
			{
				return function()
				{
					jQuery('#'+id).css('-webkit-transition', value)
				};
			})(id, t.css('-webkit-transition'));
	
			t.css('-webkit-transition','0s');
			setTimeout(closure, 2500);
		}
		t.addClass('highlight');
	},
	unhighlight:function()
	{
		jQuery('#'+this.tabs.idprefix+'-item-'+this.tabn).removeClass('highlight');
	},
	setTitle:function(title)
	{
		jQuery('#'+this.tabs.idprefix+'-item-'+this.tabn).find('.tab-title a').first().html(title);
	},
	close:function()
	{
		this.onbeforeclose(this.onbeforeclosedata);
		this.tabs.close(this.tabn);
		this.onafterclose(this.onafterclosedata);
		this.tabn = null;
		this.tabs = null;
		this.banner.destroy();
	},
	setContent:function(element)
	{
		jQuery('#'+this.tabs.idprefix+'-cont-'+this.tabn).html("<div class='clear'></div>").prepend(element);
	},
	onBeforeClose:function(data, callback)
	{
		this.onbeforeclose = callback;
		this.onbeforeclosedata = data;
	},
	onAfterClose:function(data, callback)
	{
		this.onafterclose = callback;
		this.onafterclosedata = data;
	},
	onBeforeSelect:function(data, callback)
	{
		this.onbeforeselect = callback;
		this.onbeforeselectdata = data;
	},
	onAfterSelect:function(data, callback)
	{
		this.onafterselect = callback;
		this.onafterselectdata = data;
	},
	onBeforeUnselect:function(data, callback)
	{
		this.onbeforeunselect = callback;
		this.onbeforeunselectdata = data;
	},
	onAfterUnselect:function(data, callback)
	{
		this.onafterunselect = callback;
		this.onafterunselectdata = data;
	},
	resetBannerPath:function()
	{
		this.banner.resetPath();
	},
	appendBannerPath:function(name, data, callback)
	{
		this.banner.appendPath(name, data, callback);
	}
});

var Tabs = Class.extend({

	init:function(idprefix, ontabselect)
	{
		this.ontabselect = ontabselect;
		this.createfirsttime = true;
		this.idprefix = idprefix;
		this.tabs = new Array();
		this.tabn_selected = 0;


		this.tabs[0] = new Tab(0, this, '');
		this.tabs[0].banner.show();

		jQuery('#'+this.idprefix+'-item-0').addClass('active');
		jQuery('#'+this.idprefix+'-cont-0').show();
		jQuery('#'+this.idprefix+'-item-0').click({tab:this.tabs[0]}, function(event) {event.data.tab.select();return false;});
	},
	destroy: function()
	{
		for (var i = 1; i < this.tabs.length; i++)
			if (this.tabs[i])
				this.tabs[i].close();
		jQuery('#'+this.idprefix+'-item-0').removeClass('active');
		jQuery('#'+this.idprefix+'-cont-0').hide();
		jQuery('#'+this.idprefix+'-item-0').unbind('click');
		this.tabs[0].banner.destroy();
	},
	onCreateFirstTime:function(data, callback)
	{
		this.oncreatefirsttime = callback;
		this.oncreatefirsttimedata = data;
	},
	getNumberTabs:function()
	{
		var count = 0;
		for (var i = 0; i < this.tabs.length; i++)
			if (this.tabs[i]!=null)
				count++;
		return count;
	},
	isSelected:function(tabn)
	{
		return this.tabn_selected==tabn;
	},
	getUsableTabn:function()
	{
		for (var i = 0; i < this.tabs.length; i++)
			if (this.tabs[i] == null)
				return i;
		return this.tabs.length;
	},
	getCurrentSelectedTab:function()
	{
		return this.tabs[this.tabn_selected];
	},
	setWidth:function(t, w)
	{
		t.width(w);
		t.find('.tab-title').width(w-20);
	},
	setWidths:function(w)
	{
		var c = jQuery('#'+this.idprefix+'-items').children();
		for (var i = 0; i < c.length; i++)
			this.setWidth(jQuery(c[i]), w);
	},
	getFirstTab:function()
	{
		return this.tabs[0];
	},
	create:function(title, hash)
	{
		if (!title)
			title = "<img src='/imgs/horiz-wait.gif' alt='loading' class='load-tab-item' />";

		if (this.createfirsttime)
		{
			this.createfirsttime = false;
			if (this.oncreatefirsttime)
				this.oncreatefirsttime(this.oncreatefirsttimedata);
			this.oncreatefirsttime = null;
			this.oncreatefirsttimedata = null;
		}

		var tabn = this.getUsableTabn();

		var num_tabs = this.getNumberTabs();
		if (num_tabs>=18)
		{
			modal.display_info(LANG['msg_tab_limit_title'],LANG['msg_tab_limit']);
			return null;
		}

		var tab = new Tab(tabn,this,hash);
		this.tabs[tabn] = tab;
		jQuery('#'+this.idprefix+'-container').append("<div id='"+this.idprefix+"-cont-"+tabn+"' class='tab-body'></div>");

		var newtab = jQuery("<li id='"+this.idprefix+"-item-"+tabn+"' class='"+this.idprefix+"-item'><div class='close-icon fr'></div><div class='tab-title'><a href='#"+this.idprefix+"-item-"+tabn+"'>"+title+"</a></div></li>");
	
		num_tabs++;
	
		if (num_tabs>7)
		{
			var magic = 826/num_tabs;
			this.setWidths( magic );
			this.setWidth(newtab, magic);
			newtab.width( magic );
			newtab.hide();
		}
		
		
		newtab.click({tab:tab}, function(event)
		{
			//alert(event.which);
			//event.data.tab.select();
			return false;
		});
		newtab.mousedown({tab:tab}, function(event)
		{
			if (event.which===1)
				event.data.tab.select();
			else if (event.which===2)
				jQuery(this).find('.close-icon').click();
			return false;
		});
		newtab.mouseup({tab:tab}, function(event)
		{
			return false;
		});
		newtab.find('.close-icon').click({tab:tab}, function(event)
		{
			event.data.tab.close();
			return false;
		});
	
		jQuery('#'+this.idprefix+'-items').append(newtab);
		
		if (num_tabs>7)
			setTimeout(function(){newtab.show();},400)

	
		return tab;
	},
	select:function(tabn)
	{
		this.unselect();
		jQuery('#'+this.idprefix+'-item-'+tabn).addClass('active');
		jQuery('#'+this.idprefix+'-cont-'+tabn).show();
		this.tabn_selected = tabn;
		jQuery.scrollTo(0);
	},
	unselect:function()
	{
		var tab = this.tabs[this.tabn_selected];
		if (tab)
		{
			tab.dobeforeunselect();
			jQuery('#'+this.idprefix+'-item-'+this.tabn_selected).removeClass('active');
			jQuery('#'+this.idprefix+'-cont-'+this.tabn_selected).hide();
			tab.doafterunselect();
		}
	},
	close:function(tabn)
	{
		if (tabn != 0 && this.tabn_selected==tabn)
		{
			var t = tabn-1;
			while (this.tabs[t]==null)
				t--;
			this.tabs[t].select();
		}
		jQuery('#'+this.idprefix+'-item-'+tabn).remove();
		jQuery('#'+this.idprefix+'-cont-'+tabn).remove();
		this.tabs[tabn] = null;
	
		var num_tabs = this.getNumberTabs();
		if (num_tabs>7)
			this.setWidths( 826/num_tabs );
		else
			this.setWidths(120);
	}
});

var BANNERCOUNT = 0;

var Banner = Class.extend({

	init:function()
	{
		this.element = jQuery("<div class='banner'></div>");
		jQuery('#banners').append(this.element);
	},
	resetPath:function()
	{
		this.element.html('');
	},
	appendPath:function(name, data, callback)
	{
		if (this.element.html().length>0)
			this.element.append(' &rarr; ');
		this.element.append("<a href='' class='banner-"+BANNERCOUNT+"'>"+name+"</a>");

		this.element.find('.banner-'+BANNERCOUNT).click((function(data, callback)
		{
			return function()
			{
				if (!data)
					jQuery.scrollTo(0,200);
				else
					callback(data);
				return false;
			};
		})(data, callback));
		BANNERCOUNT++;
	},
	getElement:function()
	{
		return this.element;
	},
	hide:function()
	{
		this.element.hide();
	},
	show:function()
	{
		this.element.show();
	},
	destroy:function()
	{
		this.element.remove();
	}
});
