(function ($) {
	'use strict';

	var
	PROTOCOL = '(?:\\w+:\\/\\/)',
	HTTP = PROTOCOL + '?((?:[a-z0-9-.]*[a-z0-9][a-z0-9-]*[a-z0-9]\\.[a-z][a-z0-9-]*[a-z0-9]|\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})',
	HTTP_FILE = HTTP + '\\/.*\\.',
	ADD_EVENT_LISTENER = 'addEventListener' in window ? 'addEventListener' : 'attachEvent',
	ON = 'addEventListener' in window ? '' : 'on';

	function Urlicon(input, options) {
		options = options || {};

		var instance = this, key;

		// use options
		for (key in Urlicon) instance[key] = options[key] || Urlicon[key];

		// force use protocol on input[type="url"]
		instance.useprotocol = /url/i.test(input.type) || instance.useprotocol;

		// catch simple errors
		if (!input || !('value' in input) || input.className.indexOf(instance.prefix + '-input') !== -1) return;

		var
		// elements
		field = document.createElement('span'),
		image = document.createElement('img'),
		// detect present focus
		inputFocused = document.activeElement === input || input.autofocus,
		// image timeout
		imageTimeout;

		// on key event
		function onkey() {
			var
			// current input value
			url = input.value,
			// prefix protocol if input type is url
			urlProtocol = instance.useprotocol ? (input.value.match(new RegExp(PROTOCOL)) || ['http://'])[0] : '',
			// expected result
			result,
			// possible favicon
			favicon, faviconURL,
			name, medium;

			// for each medium
			for (name in instance.mediums) {
				medium = instance.mediums[name];

				// if medium matches
				if (medium.regx.test(url)) {
					// assign result
					result = {
						href: medium.href,
						name: name,
						regx: url.match(medium.regx)
					};

					break;
				}
			}

			// clear timeout
			clearTimeout(imageTimeout);

			// if result was assigned
			if (result) {
				// get url
				url = urlProtocol + (result.href ? result.href + '/' : '') + result.regx[1];

				// get favicon
				faviconURL = (urlProtocol || '//') + url.match(new RegExp(HTTP + ')'))[1] + '/favicon.ico';

				// debounce icon change
				imageTimeout = setTimeout(function () {
					// if presence is www, attempt to load the site favicon
					if (instance.usefavicon) {
						favicon = new Image();

						favicon.onload = function () {
							image.src = favicon.src;
						};

						favicon.onerror = function () {
							image.src = instance.path + '/' + result.name + '.png';
						};

						favicon.src = faviconURL;
					}
					// assign image
					else image.src = instance.path + '/' + result.name + '.png';
				}, instance.delay);

				// conditionally redefine url
				if (url !== input.value) input.value = url;
			}
			// if result was not assigned and image is not default
			else if (image.src.indexOf(instance.path + '/incomplete.png') === -1) {
				image.src = instance.path + '/incomplete.png';
			}
		}

		// assign class names
		field.className = instance.prefix + '-field';
		image.className = instance.prefix + '-image';
		input.className = input.className.replace(/^\s+|\s+$/g, '').split(/\s+/).concat(instance.prefix + '-input').join(' ');

		// assign mobile assistance
		if (!input.autocapitalize) input.autocapitalize = 'off';
		if (!input.autocorrect) input.autocorrect = 'off';
		if (!input.pattern) input.pattern = String(instance.mediums.www.regx).slice(1, -2);

		// append elements
		input.parentNode.insertBefore(field, input);
		field.appendChild(image);
		field.appendChild(input);

		// assign events
		input[ADD_EVENT_LISTENER](ON + 'change', onkey);
		input[ADD_EVENT_LISTENER](ON + 'keydown', onkey);
		input[ADD_EVENT_LISTENER](ON + 'keyup', onkey);

		onkey();

		// restore focus
		if (inputFocused) input.focus();
	}

	// defaults
	Urlicon.delay = 300;
	Urlicon.path = 'image/urlicon';
	Urlicon.prefix = 'urlicon';
	Urlicon.usefavicon = false;
	Urlicon.useprotocol = false;

	Urlicon.mediums = {
		dailymotion: {
			regx: /dailymotion\.com\/(?:embed\/video|swf|video)\/([^\/?&#]+)/i,
			href: 'dai.ly'
		},
		facebook: {
			regx: /(?:facebook|fb)\.com\/(?:pages\/)?([^?&#]+)/i,
			href: 'fb.com'
		},
		flickr: {
			regx: /flickr\.com\/(?:(?:people|photos)\/)?([^\/?&#]+)/i,
			href: 'flickr.com/people'
		},
		github: {
			regx: /(?:www\.)?((?:[^.]+)?(?:git\.io|github\.com)\/.+)/,
			href: ''
		},
		googlemaps: {
			regx: /(maps\.google\.com.+)/i,
			href: 'maps.google.com'
		},
		googleplus: {
			regx: /(?:plus\.google\.com|gplus\.to)\/([^\/?&#]+)/i,
			href: 'plus.google.com'
		},
		instagram: {
			regx: /instagram\.com\/p\/([^\/?&#]+)/i,
			href: 'instragram.com'
		},
		linkedin: {
			regx: /linkedin\.com\/(?:in|pub)\/([^\/?&#]+)/i,
			href: 'linkedin.com/in'
		},
		soundcloud: {
			regx: /(?:api\.soundcloud\.com\/tracks\/|(?:w\.)?soundcloud\.com\/player\/.*[?&#]url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F)([^\/?&]+)/i,
			href: 'soundcloud.com'
		},
		tumblr: {
			regx: /([^.]+\.tumblr\.com)/i,
			href: ''
		},
		twitter: {
			regx: /(?:^@|twitter\.com\/)([^\/?&#]+)/i,
			href: 'twitter.com'
		},
		vimeo: {
			regx: /vimeo\.com\/(?:channels\/.+?\/|groups\/.+?\/videos\/)?([^\/?&#]+)/i,
			href: 'vimeo.com'
		},
		vine: {
			regx: /vine\.co\/v\/([^\/?&#]+)/i,
			href: 'vine.com'
		},
		youtube: {
			regx: /(?:youtube\.com|youtu\.be)\/(?:watch.*[?&#]v=|v\/|embed\/|apiplayer.*[?&#]video_id=)?([a-zA-Z0-9_-]{11})/i,
			href: 'youtu.be'
		},
		youtubeuser: {
			regx: /youtube\.com\/(?:user\/)?([^\/?&#]+)/i,
			href: 'youtube.com'
		},

		audio: {
			regx: new RegExp(HTTP_FILE + '(?:aac|aiff?|au|flac|iff|m3u|m4a|mid|mod|mp3|mpa|ogg|ram?|vox|wav|wma))$', 'i'),
			href: ''
		},
		document: {
			regx: new RegExp(HTTP_FILE + '(?:docx?|log|msg|odt|pages|pdf|rtf|tex|txt|wpd|wps))$', 'i'),
			href: ''
		},
		image: {
			regx: new RegExp(HTTP_FILE + '(?:ai|bmp|dds|dwg|dxf|eps|gif|ico|indd|jpe?g|pct|png|ps?d|pspimage|svg|tga|thm|tiff?|webp|yuv))$', 'i'),
			href: ''
		},
		spreadsheet: {
			regx: new RegExp(HTTP_FILE + '(?:accdb|csv|dat|dbf?|gbr|ged|ibooks|key(?:chain)?|mdb|pbd|pps|pptx?|sdf|sql|tax\\d*|vcf|xlr|xlsx?))$', 'i'),
			href: ''
		},
		video: {
			name: 'video',
			regx: new RegExp(HTTP_FILE + '(?:3g2|3gp|asf|asx|avi|flv|m4v|mkv|mov|mp4|mpe?g|ogv|qt|rm|srt|swf|vob|webm|wmv))$', 'i'),
			href: ''
		},
		www: {
			regx: new RegExp(HTTP + '(?:\\/.*)?)$', 'i'),
			href: ''
		}
	};

	$.urlicon = Urlicon;

	$.fn.urlicon = function (options) {
		return this.each(function () {
			new Urlicon(this, options);
		});
	};
})(this.jQuery);
