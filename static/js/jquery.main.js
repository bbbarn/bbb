jQuery(function(){
    window.stickies = [];
    initRetinaCover();
    initStickyScrollBlock();
    initAnchors();
    removeJumbo();
});
console.log(window);
window.removedJumbo = false;
console.log("removedJumbo: " + window.removedJumbo);
function removeJumbo(){
  jQuery(window).on('scroll', function () {
    var top = jQuery(window).scrollTop();
	if (jQuery('.jumbotron').length > 0){
	    divBottom = jQuery('.jumbotron').offset().top + jQuery('.jumbotron').outerHeight();
	    if (divBottom <= top && window.removedJumbo == false) {
	      jQuery('.jumbotron-remove').addClass('out-of-view').remove();
	      isMobileView = $(window).width() < 768;
	      if (!isMobileView && !jQuery('.header-project .navbar')){
	        window.scrollTo(0, 0);  // fixes bug in safari where we remove jumbotron and whole page jumps
	      }
	      window.removedJumbo = true;
	      initStickyScrollBlock();  
      
	    }
	}
	
  });
}

// initialize smooth anchor links
function initAnchors() {
	new SmoothScroll({
		anchorLinks: '.to-top-holder a[href^="#"]:not([href="#"])',
		extraOffset: 0,
		wheelBehavior: 'none'
	});
}

function initRetinaCover() {
	jQuery('.bg-stretch').retinaCover();
}

function stickIt(elem, opts){
  console.log(window.stickies.length);
  for (i = 0; i < window.stickies.length; i++){
    console.log('destroying: ' + window.stickies[i])
    $(window.stickies[i][0]).data("StickyScrollBlock").destroy()
  }
  elem.stickyScrollBlock(stickyOpts);
  window.stickies.push(elem)
  console.log("after enter" + window.stickies.length)
}

// initialize fixed blocks on scroll
function initStickyScrollBlock() {
	stickyOpts = {
		setBoxHeight: false,
		activeClass: 'fixed-position',
		positionType: 'fixed',
    fixedOn: function(){
      jQuery('section.section-fix').addClass('section-fixed-on');
    },
    fixedOff: function(){
      jQuery('section.section-fix').removeClass('section-fixed-on');
    },
		extraTop: function() {
			var totalHeight = 0;
			jQuery("0").each(function() {
				totalHeight += jQuery(this).outerHeight();
			});
      return totalHeight;
      // return 500;
		},
    onDestroy: function(){
      console.log("I'm Destroyed")
    }
	}
  console.log('starting sticky')
  isMobileView = $(window).width() < 768;
  console.log($(window).width());
  if (isMobileView){
    // if (jQuery('#header .navbar').data("StickyScrollBlock")){
    //   jQuery('#header .navbar').data("StickyScrollBlock").destroy()
    // }

    jQuery('#header').stickyScrollBlock(stickyOpts);
    // stickIt(jQuery('#header'), stickyOpts)
  } else {
    // if (jQuery('#header').data("StickyScrollBlock")){
    //   jQuery('#header').data("StickyScrollBlock").destroy()
    // }
    jQuery('#header .navbar').stickyScrollBlock(stickyOpts);
    // stickIt(jQuery('#header .navbar'), stickyOpts)
  }
  
  jQuery('.header-project .navbar').stickyScrollBlock(stickyOpts);
  
}

var isInViewport = function (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

$(document).ready(function(){
  
  window.stickies = [];

  console.log('stickies init' + window.stickies.length)
    
  images = jQuery('.home .section-cards .img-color');
  
    $(window).on('scroll', function(){
      if( $(window).width() < 768){
      for (i = 0; i<images.length; i++){
        img = $(images[i]);
        if (isInViewport(images[i])){
          img.css('opacity', 1)
        }else{
          img.css('opacity', 0)
        };
      }
    }
  })
    
});


/*!
 * SmoothScroll module
 */
;(function($, exports) {
	// private variables
	var page,
		win = $(window),
		activeBlock, activeWheelHandler,
		wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll');

	// animation handlers
	function scrollTo(offset, options, callback) {
		// initialize variables
		var scrollBlock;
		if (document.body) {
			if (typeof options === 'number') {
				options = {
					duration: options
				};
			} else {
				options = options || {};
			}
			page = page || $('html, body');
			scrollBlock = options.container || page;
		} else {
			return;
		}

		// treat single number as scrollTop
		if (typeof offset === 'number') {
			offset = {
				top: offset
			};
		}

		// handle mousewheel/trackpad while animation is active
		if (activeBlock && activeWheelHandler) {
			activeBlock.off(wheelEvents, activeWheelHandler);
		}
		if (options.wheelBehavior && options.wheelBehavior !== 'none') {
			activeWheelHandler = function(e) {
				if (options.wheelBehavior === 'stop') {
					scrollBlock.off(wheelEvents, activeWheelHandler);
					scrollBlock.stop();
				} else if (options.wheelBehavior === 'ignore') {
					e.preventDefault();
				}
			};
			activeBlock = scrollBlock.on(wheelEvents, activeWheelHandler);
		}

		// start scrolling animation
		scrollBlock.stop().animate({
			scrollLeft: offset.left,
			scrollTop: offset.top
		}, options.duration, function() {
			if (activeWheelHandler) {
				scrollBlock.off(wheelEvents, activeWheelHandler);
			}
			if ($.isFunction(callback)) {
				callback();
			}
		});
	}

	// smooth scroll contstructor
	function SmoothScroll(options) {
		this.options = $.extend({
			anchorLinks: 'a[href^="#"]', // selector or jQuery object
			container: null, // specify container for scrolling (default - whole page)
			extraOffset: null, // function or fixed number
			activeClasses: null, // null, "link", "parent"
			easing: 'swing', // easing of scrolling
			animMode: 'duration', // or "speed" mode
			animDuration: 800, // total duration for scroll (any distance)
			animSpeed: 1500, // pixels per second
			anchorActiveClass: 'anchor-active',
			sectionActiveClass: 'section-active',
			wheelBehavior: 'stop', // "stop", "ignore" or "none"
			useNativeAnchorScrolling: false // do not handle click in devices with native smooth scrolling
		}, options);
		this.init();
	}
	SmoothScroll.prototype = {
		init: function() {
			this.initStructure();
			this.attachEvents();
			this.isInit = true;
		},
		initStructure: function() {
			var self = this;

			this.container = this.options.container ? $(this.options.container) : $('html,body');
			this.scrollContainer = this.options.container ? this.container : win;
			this.anchorLinks = jQuery(this.options.anchorLinks).filter(function() {
				return jQuery(self.getAnchorTarget(jQuery(this))).length;
			});
		},
		getId: function(str) {
			try {
				return '#' + str.replace(/^.*?(#|$)/, '');
			} catch (err) {
				return null;
			}
		},
		getAnchorTarget: function(link) {
			// get target block from link href
			var targetId = this.getId($(link).attr('href'));
			return $(targetId.length > 1 ? targetId : 'html');
		},
		getTargetOffset: function(block) {
			// get target offset
			var blockOffset = block.offset().top;
			if (this.options.container) {
				blockOffset -= this.container.offset().top - this.container.prop('scrollTop');
			}

			// handle extra offset
			if (typeof this.options.extraOffset === 'number') {
				blockOffset -= this.options.extraOffset;
			} else if (typeof this.options.extraOffset === 'function') {
				blockOffset -= this.options.extraOffset(block);
			}
			return {
				top: blockOffset
			};
		},
		attachEvents: function() {
			var self = this;

			// handle active classes
			if (this.options.activeClasses && this.anchorLinks.length) {
				// cache structure
				this.anchorData = [];

				for (var i = 0; i < this.anchorLinks.length; i++) {
					var link = jQuery(this.anchorLinks[i]),
						targetBlock = self.getAnchorTarget(link),
						anchorDataItem = null;

					$.each(self.anchorData, function(index, item) {
						if (item.block[0] === targetBlock[0]) {
							anchorDataItem = item;
						}
					});

					if (anchorDataItem) {
						anchorDataItem.link = anchorDataItem.link.add(link);
					} else {
						self.anchorData.push({
							link: link,
							block: targetBlock
						});
					}
				};

				// add additional event handlers
				this.resizeHandler = function() {
					if (!self.isInit) return;
					self.recalculateOffsets();
				};
				this.scrollHandler = function() {
					self.refreshActiveClass();
				};

				this.recalculateOffsets();
				this.scrollContainer.on('scroll', this.scrollHandler);
				win.on('resize.SmoothScroll load.SmoothScroll orientationchange.SmoothScroll refreshAnchor.SmoothScroll', this.resizeHandler);
			}

			// handle click event
			this.clickHandler = function(e) {
				self.onClick(e);
			};
			if (!this.options.useNativeAnchorScrolling) {
				this.anchorLinks.on('click', this.clickHandler);
			}
		},
		recalculateOffsets: function() {
			var self = this;
			$.each(this.anchorData, function(index, data) {
				data.offset = self.getTargetOffset(data.block);
				data.height = data.block.outerHeight();
			});
			this.refreshActiveClass();
		},
		toggleActiveClass: function(anchor, block, state) {
			anchor.toggleClass(this.options.anchorActiveClass, state);
			block.toggleClass(this.options.sectionActiveClass, state);
		},
		refreshActiveClass: function() {
			var self = this,
				foundFlag = false,
				containerHeight = this.container.prop('scrollHeight'),
				viewPortHeight = this.scrollContainer.height(),
				scrollTop = this.options.container ? this.container.prop('scrollTop') : win.scrollTop();

			// user function instead of default handler
			if (this.options.customScrollHandler) {
				this.options.customScrollHandler.call(this, scrollTop, this.anchorData);
				return;
			}

			// sort anchor data by offsets
			this.anchorData.sort(function(a, b) {
				return a.offset.top - b.offset.top;
			});

			// default active class handler
			$.each(this.anchorData, function(index) {
				var reverseIndex = self.anchorData.length - index - 1,
					data = self.anchorData[reverseIndex],
					anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

				if (scrollTop >= containerHeight - viewPortHeight) {
					// handle last section
					if (reverseIndex === self.anchorData.length - 1) {
						self.toggleActiveClass(anchorElement, data.block, true);
					} else {
						self.toggleActiveClass(anchorElement, data.block, false);
					}
				} else {
					// handle other sections
					if (!foundFlag && (scrollTop >= data.offset.top - 1 || reverseIndex === 0)) {
						foundFlag = true;
						self.toggleActiveClass(anchorElement, data.block, true);
					} else {
						self.toggleActiveClass(anchorElement, data.block, false);
					}
				}
			});
		},
		calculateScrollDuration: function(offset) {
			var distance;
			if (this.options.animMode === 'speed') {
				distance = Math.abs(this.scrollContainer.scrollTop() - offset.top);
				return (distance / this.options.animSpeed) * 1000;
			} else {
				return this.options.animDuration;
			}
		},
		onClick: function(e) {
			var targetBlock = this.getAnchorTarget(e.currentTarget),
				targetOffset = this.getTargetOffset(targetBlock);

			e.preventDefault();
			scrollTo(targetOffset, {
				container: this.container,
				wheelBehavior: this.options.wheelBehavior,
				duration: this.calculateScrollDuration(targetOffset)
			});
			this.makeCallback('onBeforeScroll', e.currentTarget);
		},
		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},
		destroy: function() {
			var self = this;

			this.isInit = false;
			if (this.options.activeClasses) {
				win.off('resize.SmoothScroll load.SmoothScroll orientationchange.SmoothScroll refreshAnchor.SmoothScroll', this.resizeHandler);
				this.scrollContainer.off('scroll', this.scrollHandler);
				$.each(this.anchorData, function(index) {
					var reverseIndex = self.anchorData.length - index - 1,
						data = self.anchorData[reverseIndex],
						anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

					self.toggleActiveClass(anchorElement, data.block, false);
				});
			}
			this.anchorLinks.off('click', this.clickHandler);
		}
	};

	// public API
	$.extend(SmoothScroll, {
		scrollTo: function(blockOrOffset, durationOrOptions, callback) {
			scrollTo(blockOrOffset, durationOrOptions, callback);
		}
	});

	// export module
	exports.SmoothScroll = SmoothScroll;
}(jQuery, this));

/*
 * jQuery sticky box plugin
 */
;(function($, $win) {
	'use strict';

	function StickyScrollBlock($stickyBox, options) {
		this.options = options;
		this.$stickyBox = $stickyBox;
		this.init();
	}

	var StickyScrollBlockPrototype = {
		init: function() {
			this.findElements();
			this.attachEvents();
			this.makeCallback('onInit');
		},

		findElements: function() {
			// find parent container in which will be box move
			this.$container = this.$stickyBox.closest(this.options.container);
			// define box wrap flag
			this.isWrap = this.options.positionType === 'fixed' && this.options.setBoxHeight;
			// define box move flag
			this.moveInContainer = !!this.$container.length;
			// wrapping box to set place in content
			if (this.isWrap) {
				this.$stickyBoxWrap = this.$stickyBox.wrap('<div class="' + this.getWrapClass() + '"/>').parent();
			}
			//define block to add active class
			this.parentForActive = this.getParentForActive();
			this.isInit = true;
		},

		attachEvents: function() {
			var self = this;

			// bind events
			this.onResize = function() {
				if (!self.isInit) return;
				self.resetState();
				self.recalculateOffsets();
				self.checkStickyPermission();
				self.scrollHandler();
			};

			this.onScroll = function() {
				self.scrollHandler();
			};

			// initial handler call
			this.onResize();

			// handle events
			$win.on('load resize orientationchange', this.onResize)
				.on('scroll', this.onScroll);
		},

		defineExtraTop: function() {
			// define box's extra top dimension
			var extraTop;

			if (typeof this.options.extraTop === 'number') {
				extraTop = this.options.extraTop;
			} else if (typeof this.options.extraTop === 'function') {
				extraTop = this.options.extraTop();
			}

			this.extraTop = this.options.positionType === 'absolute' ?
				extraTop :
				Math.min(this.winParams.height - this.data.boxFullHeight, extraTop);
		},

		checkStickyPermission: function() {
			// check the permission to set sticky
			this.isStickyEnabled = this.moveInContainer ?
				this.data.containerOffsetTop + this.data.containerHeight > this.data.boxFullHeight + this.data.boxOffsetTop + this.options.extraBottom :
				true;
		},

		getParentForActive: function() {
			if (this.isWrap) {
				return this.$stickyBoxWrap;
			}

			if (this.$container.length) {
				return this.$container;
			}

			return this.$stickyBox;
		},

		getWrapClass: function() {
			// get set of container classes
			try {
				return this.$stickyBox.attr('class').split(' ').map(function(name) {
					return 'sticky-wrap-' + name;
				}).join(' ');
			} catch (err) {
				return 'sticky-wrap';
			}
		},

		resetState: function() {
			// reset dimensions and state
			this.stickyFlag = false;
			this.$stickyBox.css({
				'-webkit-transition': '',
				'-webkit-transform': '',
				transition: '',
				transform: '',
				position: '',
				width: '',
				left: '',
				top: ''
			}).removeClass(this.options.activeClass);

			if (this.isWrap) {
				this.$stickyBoxWrap.removeClass(this.options.activeClass).removeAttr('style');
			}

			if (this.moveInContainer) {
				this.$container.removeClass(this.options.activeClass);
			}
		},

		recalculateOffsets: function() {
			// define box and container dimensions
			this.winParams = this.getWindowParams();

			this.data = $.extend(
				this.getBoxOffsets(),
				this.getContainerOffsets()
			);

			this.defineExtraTop();
		},

		getBoxOffsets: function() {
			function offetTop(obj){
				obj.top = 0;
				return obj
			}
			var boxOffset = this.$stickyBox.css('position') ==='fixed' ? offetTop(this.$stickyBox.offset()) : this.$stickyBox.offset();
			var boxPosition = this.$stickyBox.position();

			return {
				// sticky box offsets
				boxOffsetLeft: boxOffset.left,
				boxOffsetTop: boxOffset.top,
				// sticky box positions
				boxTopPosition: boxPosition.top,
				boxLeftPosition: boxPosition.left,
				// sticky box width/height
				boxFullHeight: this.$stickyBox.outerHeight(true),
				boxHeight: this.$stickyBox.outerHeight(),
				boxWidth: this.$stickyBox.outerWidth()
			};
		},

		getContainerOffsets: function() {
			var containerOffset = this.moveInContainer ? this.$container.offset() : null;

			return containerOffset ? {
				// container offsets
				containerOffsetLeft: containerOffset.left,
				containerOffsetTop: containerOffset.top,
				// container height
				containerHeight: this.$container.outerHeight()
			} : {};
		},

		getWindowParams: function() {
			return {
				height: window.innerHeight || document.documentElement.clientHeight
			};
		},

		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},

		destroy: function() {
			this.isInit = false;
			// remove event handlers and styles
			$win.off('load resize orientationchange', this.onResize)
				.off('scroll', this.onScroll);
			this.resetState();
			this.$stickyBox.removeData('StickyScrollBlock');
			if (this.isWrap) {
				this.$stickyBox.unwrap();
			}
			this.makeCallback('onDestroy');
		}
	};

	var stickyMethods = {
		fixed: {
			scrollHandler: function() {
				this.winScrollTop = $win.scrollTop();
				var isActiveSticky = this.winScrollTop -
					(this.options.showAfterScrolled ? this.extraTop : 0) -
					(this.options.showAfterScrolled ? this.data.boxHeight + this.extraTop : 0) >
					this.data.boxOffsetTop - this.extraTop;

				if (isActiveSticky) {
					this.isStickyEnabled && this.stickyOn();
				} else {
					this.stickyOff();
				}
			},

			stickyOn: function() {
				if (!this.stickyFlag) {
					this.stickyFlag = true;
					this.parentForActive.addClass(this.options.activeClass);
					this.$stickyBox.css({
						width: this.data.boxWidth,
						position: this.options.positionType
					});
					if (this.isWrap) {
						this.$stickyBoxWrap.css({
							height: this.data.boxFullHeight
						});
					}
					this.makeCallback('fixedOn');
				}
				this.setDynamicPosition();
			},

			stickyOff: function() {
				if (this.stickyFlag) {
					this.stickyFlag = false;
					this.resetState();
					this.makeCallback('fixedOff');
				}
			},

			setDynamicPosition: function() {
				this.$stickyBox.css({
					top: this.getTopPosition(),
					left: this.data.boxOffsetLeft - $win.scrollLeft()
				});
			},

			getTopPosition: function() {
				if (this.moveInContainer) {
					var currScrollTop = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;

					return Math.min(this.extraTop, (this.data.containerHeight + this.data.containerOffsetTop) - currScrollTop);
				} else {
					return this.extraTop;
				}
			}
		},
		absolute: {
			scrollHandler: function() {
				this.winScrollTop = $win.scrollTop();
				var isActiveSticky = this.winScrollTop > this.data.boxOffsetTop - this.extraTop;

				if (isActiveSticky) {
					this.isStickyEnabled && this.stickyOn();
				} else {
					this.stickyOff();
				}
			},

			stickyOn: function() {
				if (!this.stickyFlag) {
					this.stickyFlag = true;
					this.parentForActive.addClass(this.options.activeClass);
					this.$stickyBox.css({
						width: this.data.boxWidth,
						transition: 'transform ' + this.options.animSpeed + 's ease',
						'-webkit-transition': 'transform ' + this.options.animSpeed + 's ease',
					});

					if (this.isWrap) {
						this.$stickyBoxWrap.css({
							height: this.data.boxFullHeight
						});
					}

					this.makeCallback('fixedOn');
				}

				this.clearTimer();
				this.timer = setTimeout(function() {
					this.setDynamicPosition();
				}.bind(this), this.options.animDelay * 1000);
			},

			stickyOff: function() {
				if (this.stickyFlag) {
					this.clearTimer();
					this.stickyFlag = false;

					this.timer = setTimeout(function() {
						this.setDynamicPosition();
						setTimeout(function() {
							this.resetState();
						}.bind(this), this.options.animSpeed * 1000);
					}.bind(this), this.options.animDelay * 1000);
					this.makeCallback('fixedOff');
				}
			},

			clearTimer: function() {
				clearTimeout(this.timer);
			},

			setDynamicPosition: function() {
				var topPosition = Math.max(0, this.getTopPosition());

				this.$stickyBox.css({
					transform: 'translateY(' + topPosition + 'px)',
					'-webkit-transform': 'translateY(' + topPosition + 'px)'
				});
			},

			getTopPosition: function() {
				var currTopPosition = this.winScrollTop - this.data.boxOffsetTop + this.extraTop;

				if (this.moveInContainer) {
					var currScrollTop = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;
					var diffOffset = Math.abs(Math.min(0, (this.data.containerHeight + this.data.containerOffsetTop) - currScrollTop - this.extraTop));

					return currTopPosition - diffOffset;
				} else {
					return currTopPosition;
				}
			}
		}
	};

	// jQuery plugin interface
	$.fn.stickyScrollBlock = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		var options = $.extend({
			container: null,
			positionType: 'fixed', // 'fixed' or 'absolute'
			activeClass: 'fixed-position',
			setBoxHeight: true,
			showAfterScrolled: false,
			extraTop: 0,
			extraBottom: 0,
			animDelay: 0.1,
			animSpeed: 0.2
		}, opt);

		return this.each(function() {
			var $stickyBox = jQuery(this);
			var instance = $stickyBox.data('StickyScrollBlock');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				StickyScrollBlock.prototype = $.extend(stickyMethods[options.positionType], StickyScrollBlockPrototype);
				$stickyBox.data('StickyScrollBlock', new StickyScrollBlock($stickyBox, options));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};

	// module exports
	window.StickyScrollBlock = StickyScrollBlock;
}(jQuery, jQuery(window)));

/*
 * jQuery retina cover plugin
 */
 ;(function($) {
    'use strict';

    var styleRules = {};
    var templates = {
        '2x': [
            '(-webkit-min-device-pixel-ratio: 1.5)',
            '(min-resolution: 192dpi)',
            '(min-device-pixel-ratio: 1.5)',
            '(min-resolution: 1.5dppx)'
        ],
        '3x': [
            '(-webkit-min-device-pixel-ratio: 3)',
            '(min-resolution: 384dpi)',
            '(min-device-pixel-ratio: 3)',
            '(min-resolution: 3dppx)'
        ]
    };

    function addSimple(imageSrc, media, id) {
        var style = buildRule(id, imageSrc);

        addRule(media, style);
    }

    function addRetina(imageData, media, id) {
        var currentRules = templates[imageData[1]].slice();
        var patchedRules = currentRules;
        var style = buildRule(id, imageData[0]);

        if (media !== 'default') {
            patchedRules = $.map(currentRules, function(ele, i) {
                return ele + ' and ' + media;
            });
        }

        media = patchedRules.join(',');

        addRule(media, style);
    }

    function buildRule(id, src) {
        return '#' + id + '{background-image: url("' + src + '");}';
    }

    function addRule(media, rule) {
        var $styleTag = styleRules[media];
        var styleTagData;
        var rules = '';

        if (media === 'default') {
            rules = rule + ' ';
        } else {
            rules = '@media ' + media + '{' + rule + '}';
        }

        if (!$styleTag) {
            styleRules[media] = $('<style>').text(rules).appendTo('head');
        } else {
            styleTagData = $styleTag.text();
            styleTagData = styleTagData.substring(0, styleTagData.length - 2) + ' }' + rule + '}';
            $styleTag.text(styleTagData);
        }
    }

    $.fn.retinaCover = function() {
        return this.each(function() {
            var $block = $(this);
            var $items = $block.children('[data-srcset]');
            var id = 'bg-stretch' + Date.now() + (Math.random() * 1000).toFixed(0);

            if ($items.length) {
                $block.attr('id', id);

                $items.each(function() {
                    var $item = $(this);
                    var data = $item.data('srcset').split(', ');
                    var media = $item.data('media') || 'default';
                    var dataLength = data.length;
                    var itemData;
                    var i;

                    for (i = 0; i < dataLength; i++) {
                        itemData = data[i].split(' ');

                        if (itemData.length === 1) {
                            addSimple(itemData[0], media, id);
                        } else {
                            addRetina(itemData, media, id);
                        }
                    }
                });
            }

            $items.detach();
        });
    };
 }(jQuery));

 $(document).ready(function(){
     init();
     $("#smoke").css("left", 220)
     $("#smoke").css("top", -340)
     if ($(window).width() > 790){
       $("#smoke").show();
     }
     // var easter_egg = new Konami(function() { ; });
     // $("hr.main").width($(window).width() - 30)
     $(window).on('resize', function(){
       // console.log($(window).width());
	   windowWidth = $(window).width()
	   console.log(windowWidth)
	   if ( windowWidth < 1450 && windowWidth > 768) {
		   $("#smoke").css("left", 220 - (1450 - windowWidth)/2);
		   console.log('window: ' + windowWidth)
	   }
       if (windowWidth < 768) {
         // alert('no');
         $("#smoke").hide();
       } else {
         $("#smoke").show();
       }
       // initStickyScrollBlock(); 
     })
 });
