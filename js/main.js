"use strict";

function isPirateBay() {
	return window.location.hostname.indexOf("pirate") >= 0;
}

function isKickass() {
	return window.location.hostname.indexOf("kickass") >= 0;
}

$(document).ready(function() {
	afterLoad(function() {
		if (isPirateBay()) {
			augmentPirateBay();
		}

		if (isKickass()) {
			augmentKickass();
		}

	});
});