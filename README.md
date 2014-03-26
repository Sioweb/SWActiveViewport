#SWActiveViewport

Dieses Plugin prüft ob die angegebenen Elemente im Viewport liegen:


##Contao

```
(function($){$(function(){
	$('#main .mod_article > *').activeViewport({
	minWidth: 700,
	mobile: true,
	offsetTop: 150,
	showAlreadyByEnter: true
});
});})(jQuery);
```

##Options

- bool `loadImgFirst` (Standard: `True`; Lädt zuerst Bilder; Wichtig für Chrome)
- int `offsetTop` (Standard: `200`; Damit Fixed-Header kein Problem darstellen)
- bool `showAlreadyByEnter` (Standard: `false`; Elemente werden schon beim betreten des Viewports aktiv)
- bool `mobile` (Standard: `false)
- bool `showActiveAbove` (Standard: `true`; Elemente überhalb des Viewports bleiben aktiv)
- int `minWidth` (Standard: `640`; Erst ab 640px Breite beginnen)
- string `activeClass` (Standard: `'active'`; Name der aktiven Klasse)
- function `start` (Standard: `function(){}`; Wird schon bei der Initialisierung ausgeführt)
- function `enterState` (Standard: `function(){}`; Wird ausgeführt wenn der Viewport erreicht wird)
- function `leaveState` (Standard: `function(){}`; Wird ausgeführt wenn der Viewport verlassen wird)