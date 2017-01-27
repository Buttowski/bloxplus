if (window.location.href.indexOf("https://www.bloxcity.com/account/ViewTrade.php?id") > -1) {
	var give = $('legend:contains("Give")').parent().parent().find('[style="font-size:12px;"]');
	var receive = $('legend:contains("Receive")').parent().parent().find('[style="font-size:12px;"]');
	var elm = $('h5:contains("trade with ")').text().split("trade with ");
	elm[0] = "";
	var trader = elm.join("");
   	$('.bc-content').prepend('<input type="submit" id="postMarket" value="Post to marketplace" class="groups-blue-button" style="padding:0;padding:4px 8px;float: right">');
	$('#postMarket').click(function() {
   		postTrade();
   	})
}

if (window.location.href.indexOf("https://www.bloxcity.com/users/search/") > -1) {
	$('.content-box').first().replaceWith('<div class="content-box" style="background: none; border-radius: 0px; border: none; padding: 0px"> <div class="row"> <div class="col s12 m2 l2"> <select class="browser-default market-dropdown" name="type"> <option value="0">Username</option> <option value="1">ID</option> </select> </div> <div class="col s12 m10 l10"> <input type="text" class="general-textbar" placeholder="Search for a user" id="query"> </div> </div> </div>');

	$(document).keypress(function(e) {
		if (e.which == 13 && $('#query').is(':focus') && $('#query').val().length > 0) {
			userSearch($('#query').val());
		}
	})
}

if (window.location.href.indexOf("https://www.bloxcity.com/user/achievements/") > -1) {

}

if (window.location.href.indexOf("https://www.bloxcity.com/users/") > -1 && $('[style="margin-bottom:0;padding-top:25px;"]').length > 0) {
	var row = $('[style="margin-bottom:0;padding-top:25px;"]');
	var thisid = window.location.href.split("https://www.bloxcity.com/users/").join("").split("/" + $('[style="font-size:26px;display:inline-block;vertical-align:middle;"]').text())[0];
	row.children().css('width', '20%');
	row.append('<div class="col s12 m12 l3 center-align" style="width: 20%;"> <div style="font-size:22px;" id="collectibles">0</div> <div style="color:#999;font-size:14px;">Collectibles</div> </div>');

	chrome.runtime.sendMessage({collectible: thisid}, function(response) {
		console.log('sent');
	});

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.ccs) {
			$('#collectibles').html(request.ccs);
		}
	});
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
	}

	for (var x = 0; x < receive.length; x++) {
		receiving.push(receive.eq(x).text())
		if (x == (receive.length - 1)) {
			postReceiving += " " + receiving[x];
		} else {
			postReceiving += " " + receiving[x] + ",";
		}
	}

	var postTitle = "Win or lose? (A/D)";
	var postMessage = "What I'm giving:" + postGiving + "\n" + "What I'm receiving:" + postReceiving;

	chrome.runtime.sendMessage({title: postTitle, message: postMessage}, function(response) {
  		console.log(postMessage);
	});
};

function userSearch(value) {
	var type = $('[name="type"]').val();
    getUser(type, value);
}

function getUser(searchType, value) {
    if (searchType == "0") {
        window.location = 'https://www.bloxcity.com/users/search/?search=' + value;
    } else if (searchType == "1") {
    	if (isNaN(parseInt(value))) {
    		alert('Not an ID');
    	} else {
    		chrome.runtime.sendMessage({id: value}, function(response) {
        		console.log('waiting');
        		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        			if (request.repo) {
        				window.location = request.repo;
        			}
        		});
        	});
    	}
    }
}