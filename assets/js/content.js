if (window.location.href.indexOf("https://www.bloxcity.com/account/ViewTrade.php?id") > -1) {
	var col1 = $('.col').first().find('[style="font-size:12px;"]');
	var col2 = $('.col').first().next().find('[style="font-size:12px;"]');
	var trader = $('h5:contains("Incoming")').text().split("Incoming trade with ").join("");
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

	for (var i = 0; i < col1.length; i++) {
		giving.push(col1.eq(i).text());
		if (i == (col1.length - 1)) {
			postGiving += " " + giving[i];
		} else {
			postGiving += " " + giving[i] + ",";
		}

		for (var x = 0; x < col2.length; x++) {
			receiving.push(col2.eq(x).text())
			if (x == (col2.length - 1)) {
				postReceiving += " " + receiving[x];
			} else {
				postReceiving += " " + receiving[x] + ",";
			}
		}
	}

	var postTitle = "Trade with " + trader + ", A/D?";
	var postMessage = "What I'm giving: " + postGiving + "\n" + "What I'm receiving: " + postReceiving;

	chrome.runtime.sendMessage({title: postTitle, message: postMessage}, function(response) {
  		console.log(postMessage);
	});
};