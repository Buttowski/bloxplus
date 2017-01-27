var user = new Object();
var recent = new Object();
var scan = new Object();
var collectible = new Audio('assets/audios/collectible.mp3');
var item = new Audio("assets/audios/item.mp3");
var per = 0;

// Just testing something with chrome notifications
var updateProgress = function(notificationID, options, callback) {
	var data = options;
	var i = data.minProgress;
	if (data.minProgress == undefined || data.maxProgress == undefined || data.refresh == undefined) {
		console.log('Missing data, include {minProgress, maxProgress, refresh, clear (boolean)}');
	} else {
		var int = setInterval(function() {
			if (i < data.maxProgress) {
				i++;
				chrome.notifications.update(notificationID, {progress: (per + i)});
			} else {
				per += i;
				if (per == 100) {
					per = 0;
				}
				if(data.clear) { chrome.notifications.clear(notificationID) };
				clearInterval(int);
				if (callback == undefined) {

				} else {
					(callback)()
				}
			}
		}, data.refresh)
	}
}