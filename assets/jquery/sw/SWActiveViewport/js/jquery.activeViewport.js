(function($){
	
	/**
	* @file jquery.activeViewport.js
	* @author Sascha Weidner
	* @class activeViewport
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
			
			if(!this.is_mobile())
				$('body').addClass('desktop');
			
			/* Nach laden des Plugins einmal ausführen ohne Event. */
			if(this.mobile || !this.is_mobile())
			{
				if(this.mobile)
					this.item.addClass('mobile_viewport_animation');
				if(this.loadImgFirst)
					$("<img/>").attr("src", $('img').eq(0).attr("src")+'?'+Math.random())
						   .bind('load',selfObj['startPlugin']);
				else
					this.startPlugin()
			}
			else
			{
				this.item.addClass('no_mobile_viewport_animation');
			}
		};
		
		this.startPlugin = function()
		{
			selfObj.scroll('');
			$(window).scroll(selfObj.scroll);
			$(window).resize(selfObj.scroll);
		};

		this.scroll = function()
		{
			var padding = parseInt(selfObj.item.css('padding-bottom'),10)+parseInt(selfObj.item.css('padding-top'),10);
			
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
			*
			* ODER wenn das Element schon beim 'Eintreten sichtbar sein soll'
			*/
			
			if(
				!selfObj.showAlreadyByEnter && (
				(
					selfObj.item.offset().top - $(window).scrollTop() >= 0 &&
					selfObj.item.offset().top - $(window).scrollTop() <= selfObj.offsetTop + padding &&
					selfObj.item.offset().top + selfObj.item.height() > $(window).scrollTop() + selfObj.offsetTop
				) || (
					selfObj.item.offset().top < $(window).scrollTop() &&
					$(window).scrollTop() >= ($(document).height() - $(window).height() - selfObj.offsetTop)
				)) || (
					selfObj.showAlreadyByEnter && (
						(selfObj.item.offset().top - $(window).scrollTop() + selfObj.offsetTop + padding) <= $(window).height() ||
						($(window).scrollTop() <= (selfObj.item.offset().top + selfObj.offsetTop + padding) && selfObj.item.offset().top <= $(window).height())
					)
				)
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

		this.is_mobile = function()
		{
			var mobile = arguments[0] || true;
			if(navigator.userAgent.match(/(iPhone|iPod|iPad|android|opera mini|palm os|palm|hiptop|avantgo|plucker|xiino|blazer|elaine|iris|3g_t|windows ce|opera mobi|windows ce; smartphone;|windows ce; iemobile)/i))
				return mobile;
			return !mobile;
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
				loadImgFirst: settings.loadImgFirst||true,
				offsetTop: settings.offsetTop||0,
				showAlreadyByEnter: settings.showAlreadyByEnter||false,
				mobile: settings.mobile||false,
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
