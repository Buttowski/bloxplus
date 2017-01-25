if (window.location.href.indexOf("https://www.bloxcity.com/account/ViewTrade.php?id") > -1) {
	var give = $('legend:contains("Give")').parent().parent().find('[style="font-size:12px;"]');;
	var receive = $('legend:contains("Receive")').parent().parent().find('[style="font-size:12px;"]');;
	var elm = $('h5:contains("trade with ")').text().split("trade with ");
	elm[0] = "";
	var trader = elm.join("");
trader
   	$('.bc-content').prepend('<input type="submit" id="postMarket" value="Post to marketplace" class="groups-blue-button" style="padding:0;padding:4px 8px;float: right">');
	$('#postMarket').click(function() {
   		postTrade();
   	})
}

function postTrade() {
	var giving = [];
	var receiving = [];
	var postGiving = "";
	var postReceiving = "";

	for (var i = 0; i < give.length; i++) {
		giving.push(give.eq(i).text());
		if (i == (give.length - 1)) {
			postGiving += " " + giving[i];
		} else {
			postGiving += " " + giving[i] + ",";
		}

		for (var x = 0; x < receive.length; x++) {
			receiving.push(receive.eq(x).text())
			if (x == (receive.length - 1)) {
				postReceiving += " " + receiving[x];
			} else {
				postReceiving += " " + receiving[x] + ",";
			}
		}
	}

	var postTitle = "Trade with " + trader + ", A/D?";
	var postMessage = "What I'm giving:" + postGiving + "\n" + "What I'm receiving:" + postReceiving;

	chrome.runtime.sendMessage({title: postTitle, message: postMessage}, function(response) {
  		console.log(postMessage);
	});
};
