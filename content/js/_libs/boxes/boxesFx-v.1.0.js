/**
 * boxesFx.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;( function( window ) {
	
	'use strict';

	// based on http://responsejs.com/labs/dimensions/
	function getViewport(axis) {
		var client, inner;
		if( axis === 'x' ) {
			client = docElem['clientWidth'];
			inner = window['innerWidth'];
		}
		else if( axis === 'y' ) {
			client = docElem['clientHeight'];
			inner = window['innerHeight'];
		}
		
		return client < inner ? inner : client;
	}

	var docElem = window.document.documentElement,
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		support = { transitions : Modernizr.csstransitions },
		win = { width : getViewport('x'), height : getViewport('y') };
	
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function BoxesFx( el, options ) {	
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
	}

	BoxesFx.prototype.options = {}

	BoxesFx.prototype._init = function() {
		// set transforms configuration
		this._setTransforms();

		// which effect
		this.effect = this.el.getAttribute( 'data-effect' ) || 'effect-1';
		// check if animating
		this.isAnimating = false;
		// the panels
		this.panels = [].slice.call( this.el.querySelectorAll( '.panel' ) );
		// total number of panels (4 for this demo)
		//this.panelsCount = this.panels.length;
		this.panelsCount = 4;
		// current panel´s index
		this.current = 0;
		classie.add( this.panels[0], 'current' );
		// replace image with 4 divs, each including the image
		var self = this;
		this.panels.forEach( function( panel ) {
			var img = panel.querySelector( 'img' ), imgReplacement = '';
			for( var i = 0; i < self.panelsCount; ++i ) {
				imgReplacement += '<div class="bg-tile"><div class="bg-img"><img src="' + img.src + '" /></div></div>'
			}
			panel.removeChild( img );
			panel.innerHTML = imgReplacement + panel.innerHTML;
		} );
		// add navigation element
		//KM this.nav = document.createElement( 'nav' );
		this.nav = $('.nav-next');
        
        //RG this.nav.innerHTML = '<span class="prev"><i></i></span><span class="next"><i></i></span>';
		/*RG*/ 
		//KM this.nav.innerHTML = '<span class="btn next"><i></i></span>';

		//KM this.el.appendChild( this.nav );
		// initialize events
		this._initEvents();
	}

	// set the transforms per effect
	// we have defined both the next and previous action transforms for each panel
	BoxesFx.prototype._setTransforms = function() {
		this.transforms = {

			'effect-3' : {
				'next' : [
					'translate3d(0,' + (win.height/2+10) + 'px, 0)',
					'translate3d(0,' + (win.height/2+10) + 'px, 0)',
					'translate3d(0,' + (win.height/2+10) + 'px, 0)',
					'translate3d(0,' + (win.height/2+10) + 'px, 0)'
				],
				'prev' : [
					'translate3d(0,-' + (win.height/2+10) + 'px, 0)',
					'translate3d(0,-' + (win.height/2+10) + 'px, 0)',
					'translate3d(0,-' + (win.height/2+10) + 'px, 0)',
					'translate3d(0,-' + (win.height/2+10) + 'px, 0)'
				]
			}
		};	
	}

	BoxesFx.prototype._initEvents = function() {
		//KM var self = this, navctrls = this.nav.children;
        var self = this;
        
		// previous action
		//RG navctrls[0].addEventListener( 'click', function() { self._navigate('prev') } );
		//RG: Added event listener to fire first scene on page load 
		window.addEventListener('load',function() { 
			setTimeout( function(){ 
				self._navigate('next'); 
  			}, 500);
		} );
		// next scene
        //KM		navctrls[0].addEventListener( 'click', function() {
        $(this.nav).on('click', function() {
            self._navigate('next');
        });

        //NAVIGATION mousewheel and keyboard events
        
        //Firefox mousewheel
		$('body').bind('DOMMouseScroll', function(e){
            if(e.originalEvent.detail > 0) {
                //scroll down
            	self._navigate('next');
		     } else {
                //scroll up
                self._navigate('prev'); 
            }
		     //prevent page fom scrolling
		     return false;
        });
        //IE, Opera, Safari mousewheel
		$('body').bind('mousewheel', function(e){
            if(e.originalEvent.wheelDelta < 0) {
                //scroll down
                self._navigate('next');
            } else {
                //scroll up
                self._navigate('prev');     }

                //prevent page fom scrolling
                return false;
            });
        //keyboard events
        $(document).keydown(function(e) {
            switch(e.which) {
                case 37: // left
                    self._navigate('prev');
                break;

                case 38: // up
                    self._navigate('prev');
                break;
                
                case 33: // page up
                    self._navigate('prev');
                break;

                case 34: // page down
                    self._navigate('next');     
                break;

                case 32: // spacebar
                    self._navigate('next');     
                break;

                case 39: // right
                    self._navigate('next');     
                break;

                case 40: // down
                    self._navigate('next');     
                break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });

		// window resize
		window.addEventListener( 'resize', function() { self._resizeHandler(); } );
	}

	// goto next or previous slide
	BoxesFx.prototype._navigate = function( dir ) {
		if( this.isAnimating ) return false;
		this.isAnimating = true;

		var self = this, currentPanel = this.panels[ this.current ];

		if( dir === 'next' ) {
            //KM-OG			this.current = this.current < this.panelsCount - 1 ? this.current + 1 : 0;	
            //KM changed ternary else condition to go to scene 1 instead of 0 (last param):
			this.current = this.current < this.panelsCount - 1 ? this.current + 1 : 1;			
		} else {
			//RG this.current = this.current > 0 ? this.current - 1 : this.panelsCount - 1;
            //KM - don't navigate previous to slide 1 (blank green)
            this.current = this.current > 1 ? this.current - 1 : this.panelsCount - 1;
		}
        
        //RG - custom behaviors and animation triggered by slide change
        //console.log("current slide: ", this.current + 1);
        if( this.current === 0 ) {
            //console.log("play slide 1 stuff");
            $('.scene.current').removeClass('current');
            $('.scene-1').addClass('current');
        } 
        else if ( this.current === 1 ) {
            //console.log("play slide 2 stuff");
            $('.scene.current').removeClass('current');
            $('.scene-2').addClass('current');
            //GSAP splitText effect in site.js: -KM
            revealText('.scene-2 h1');
        } 
        else if ( this.current === 2 ) {
            //console.log("play slide 3 stuff");
            $('.scene.current').removeClass('current');
            $('.scene-3').addClass('current');
            //GSAP splitText effect in site.js: -KM
            revealText('.scene-3 h1');
        }
        else if ( this.current === 3 ) {
            //console.log("play slide 4 stuff");
            $('.scene.current').removeClass('current');
            $('.scene-4').addClass('current');
            //GSAP timeline for last scene sequence in site.js -KM
            resultsScene();
        } 
        //END custom behaviors and animation triggered by slide change
        

		// next panel to be shown
		var nextPanel = this.panels[ this.current ];
		// add class active to the next panel to trigger its animation
		classie.add( nextPanel, 'active' );
		// apply the transforms to the current panel
		this._applyTransforms( currentPanel, dir );

		// let´s track the number of transitions ended per panel
		var cntTransTotal = 0,
			
			// transition end event function
			onEndTransitionFn = function( ev ) {
				if( ev && !classie.has( ev.target, 'bg-img' ) ) return false;

				// return if not all panel transitions ended
				++cntTransTotal;
				if( cntTransTotal < self.panelsCount ) return false;

				if( support.transitions ) {
					this.removeEventListener( transEndEventName, onEndTransitionFn );
				}

				// remove current class from current panel and add it to the next one
				classie.remove( currentPanel, 'current' );
				classie.add( nextPanel, 'current' );
				// reset transforms for the currentPanel
				self._resetTransforms( currentPanel );
				// remove class active
				classie.remove( nextPanel, 'active' );
				self.isAnimating = false;
			};

		if( support.transitions ) {
			currentPanel.addEventListener( transEndEventName, onEndTransitionFn );
		}
		else {
			onEndTransitionFn();
		}
	}

	BoxesFx.prototype._applyTransforms = function( panel, dir ) {
		var self = this;
		[].slice.call( panel.querySelectorAll( 'div.bg-img' ) ).forEach( function( tile, pos ) {
			tile.style.WebkitTransform = self.transforms[self.effect][dir][pos];
			tile.style.transform = self.transforms[self.effect][dir][pos];
		} );
	}

	BoxesFx.prototype._resetTransforms = function( panel ) {
		[].slice.call( panel.querySelectorAll( 'div.bg-img' ) ).forEach( function( tile ) {
			tile.style.WebkitTransform = 'none';
			tile.style.transform = 'none';
		} );
	}

	BoxesFx.prototype._resizeHandler = function() {
		var self = this;
		function delayed() {
			self._resize();
            
			self._resizeTimeout = null;
		}
		if ( this._resizeTimeout ) {
			clearTimeout( this._resizeTimeout );
		}
		this._resizeTimeout = setTimeout( delayed, 50 );
	}

	BoxesFx.prototype._resize = function() {
		win.width = getViewport('x');
		win.height = getViewport('y');
		this._setTransforms();
	}

	// add to global namespace
	window.BoxesFx = BoxesFx;

} )( window );