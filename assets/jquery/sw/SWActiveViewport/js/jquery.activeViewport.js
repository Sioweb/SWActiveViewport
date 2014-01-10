(function($){
	
	/**
	* @file jquery.activeViewport.js
	* @author Sascha Weidner
	* @class activeViewport
	* @copyright Sascha Weidner, Sioweb
	* http://www.sioweb.de - support|at|sioweb.de
	*
	* Prüft ob ein Element im Viewport scrollt und vergibt Klassen. Die Animationen und Effekte können dann in der CSS-Datei
	* registriert werden oder als Javascript in den Callback-Funktionen enterState und leaveState.
	*/
	
	"use strict";
	var Av = function()
	{
		var selfObj = this;
		this.item = false;
		this.itemsHeight = 0;
		this.started = false;
		
		this.init = function(elem)
		{
			/* 
			* Damit ist "this" mit dem Alias "selfObj" auch in den Events verfügbar. 
			* Das Wort "self" führt in IE zu einem Fehler.
			*/
			selfObj = this;
			/**/
			
			this.elem = elem;
			this.item = $(this.elem);
			
			/* Nach laden des Plugins einmal ausführen ohne Event. */
			this.scroll('');
			$(window).scroll(this.scroll);
			$(window).resize(this.scroll);
		};
		
		this.scroll = function()
		{
			var padding = parseInt(selfObj.item.css('padding-bottom'))+parseInt(selfObj.item.css('padding-top'));
			
			/* Gibt es eine Mindestbreite? */
			if($(window).width() >= selfObj.minWidth)
				selfObj.item.addClass('viewport_min_width');
			else
				selfObj.item.removeClass('viewport_min_width');

			if($(window).scrollTop() < 0)
				return false;
			

			/*
			* Das Element anzeigen wenn es IM Viewport angekommen ist und über OffsetTop scrollt.
			* Das letzte Element muss auch angezeigt werden wenn die ScrollHöhe nicht erreicht werden kann.
			*/
			if(
				(
					selfObj.item.offset().top - $(window).scrollTop() <= selfObj.offsetTop + padding &&
					selfObj.item.offset().top + selfObj.item.height() > $(window).scrollTop() + selfObj.offsetTop
				) 
				|| $(window).scrollTop() >= ($(document).height() - $(window).height() - selfObj.offsetTop)
			){
				/* Nur einmal Ausführen, da das Event sonst millionenfach ausgeführt wird. */
				if(!selfObj.activeState)
				{
					/* Beim ersten durchgang genau einmal Ausführen. */
					if(!selfObj.started)
						selfObj.InternStart();
					selfObj.activeState = true;

					selfObj.item.addClass(selfObj.activeClass);

					selfObj.InternEnterState();
				}
			}
			else
			{
				if(selfObj.activeState)
					selfObj.internLeaveState();
				selfObj.activeState = false;

				/* Sollen Objekte stehen bleiben die aktiv waren? Standardmäßig Ja!*/
				if(!selfObj.showActiveAbove || (selfObj.showActiveAbove && (selfObj.item.offset().top - selfObj.offsetTop) > $(window).scrollTop()))
				selfObj.item.removeClass(selfObj.activeClass);
			}
			if(selfObj.activeState)
				selfObj.started = true;
		};
	
		/**
		* @brief Liefert den Index des Objektes bspw. Index 3.
		* @return integer Index 
		*/
		this.getItemIndex = function()
		{
			return $(selfObj.item).parent().children().index(selfObj.item);
		};
	
		this.InternStart = function()
		{
			selfObj.start(selfObj.item,selfObj.getItemIndex());
		};
	
		this.InternEnterState = function()
		{
			selfObj.enterState(selfObj.item,selfObj.getItemIndex());
		};
	
		this.internLeaveState = function()
		{
			selfObj.leaveState(selfObj.item,selfObj.getItemIndex());
		};
	};
	
	$.fn.activeViewport = function(settings)
	{
		var ActiveViewport = {};
		return this.each(function()
		{
			var AV = new Av();
			
			if(!settings)
				settings = {};
			
			AV = $.extend(settings,AV);
			
			/** Standard-Einstellungen als Fallback-Einstellungen. */
			AV = $.extend({
				test: settings.test||false,
				offsetTop: 200,
				showActiveAbove: settings.showActiveAbove||true,
				minWidth: settings.minWidth||640,
				activeClass: settings.activeClass||'active',
				start: settings.start||function(){},
				enterState: settings.enterState||function(){},
				leaveState: settings.leaveState||function(){}
			},AV);
			
			/** Initialisieren. */
			AV.init(this);
			ActiveViewport[$(this).attr('id')] = AV;
        });
	};
	
})(jQuery);