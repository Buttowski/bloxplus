// This extension was created by Peridax, but it's owned by the development group Calibris.
// Getting data about your user and data about the market.
$.get('https://www.bloxcity.com/users/search/').success(function(data) {
    if ($('a[class="dropdown-button1"]', data).length > 0) {
        user.name = $('a[class="dropdown-button1"]', data).eq(0)[0].innerText.split("arrow_drop_down").join("").trim();
        user.id = $('a:contains("Profile")', data).attr('href').split("https://www.bloxcity.com/users/").join("").split("/" + user.name + "/").join("");
        user.profile = 'https://www.bloxcity.com/users/' + user.id + '/' + user.name;
        $.get('https://www.bloxcity.com/API/GetAvatar.php?UserID=' + user.id).success(function(data) {
            user.image = data.avatar;
        });
        init();
    } else if ($('a[class="dropdown-button1"]', data).length == 0) {
        chrome.notifications.create('login', {
            type: 'basic',
            title: 'BLOXPlus error',
            message: 'You are not logged in on BLOXCity.',
            iconUrl: 'https://storage.googleapis.com/bloxcity-file-storage/assets/images/BCLogo-Square.png',
            buttons: [{
                title: 'Login'
            }]
        });

        chrome.notifications.onButtonClicked.addListener(function(button) {
            if (button == "login") {
                chrome.tabs.create({
                    url: 'https://www.bloxcity.com/login/'
                })
            }
            chrome.notifications.clear(button);
            setTimeout(function() {
                init();
            }, 10000)
        });
    }
});

function init() {

    // Automatically join the group Calibris to support the developers of the extension
    $.get('https://www.bloxcity.com/groups/group.php?id=325').success(function(data) {
        if ($('[name="JoinGroup"]', data).length > 0) {
            // This get your csrf_token value and creates a new input with it in order to join a group. Notice how it submits to bloxcity, not another server.
            csrf_token = $('[name="csrf_token"]', data).val();
            var form = $('<form>');
            var submit_input = $('<input>');
            var submit_csrf = $('<input>');
            $('body').append(form);
            form.append(submit_input);
            form.append(submit_csrf);
            // Action's value is where it's posting to.
            form.attr('action', 'https://www.bloxcity.com/groups/group.php?id=325').attr('method', 'post');
            form.css('display', 'none');
            submit_input.attr('type', 'submit');
            submit_input.attr('name', 'JoinGroup');
            submit_input.attr('value', 'Join Group');
            submit_csrf.attr('type', 'hidden');
            submit_csrf.attr('name', 'csrf_token');
            submit_csrf.attr('value', csrf_token);
            submit_input.click();
            form.remove();
        } else {
            console.log('Already joined group')
        }
    });

    // Getting the latest hat
    $.get('https://www.bloxcity.com/market/recent.php?Page=1').success(function(data) {
        recent.html = $('[class="col s12 m2 l2"]', data).first();
        recent.id = recent.html.find('[href*="https://www.bloxcity.com/market/"]').attr('href').split("https://www.bloxcity.com/market/").join("").split("/").join("");
        localStorage.setItem('latest', recent.id);
    });

    // The collectible notifier
    var notifier = setInterval(function() {
        $.get('https://www.bloxcity.com/market/recent.php?Page=1').success(function(data) {
            scan.html = $('[class="col s12 m2 l2"]', data).first();
            scan.name = scan.html.find('[class="item-name"]').text();
            scan.img = scan.html.find('[src*="https://storage.googleapis.com/bloxcity-file-storage/"]').attr('src');
            scan.url = scan.html.find('[href*="https://www.bloxcity.com/market/"]').attr('href');
            scan.id = scan.html.find('[href*="https://www.bloxcity.com/market/"]').attr('href').split("https://www.bloxcity.com/market/").join("").split("/").join("");
            scan.cash = scan.html.find('.item-price-cash').text().split("copyright").join("").trim();
            scan.coins = scan.html.find('.item-price-coins').text().split("copyright").join("").trim();

            if (parseInt(localStorage.getItem('latest')) < parseInt(scan.id)) {
                localStorage.setItem('latest', scan.id);
                if (scan.html.find('.ribbon').length > 0) {
                    if (scan.html.find('[class="item-stock"]').text().trim().charAt(0) != "S") {
                        if (scan.cash.length > 0 && parseInt(scan.cash) > 0) {
                            chrome.notifications.create('new', {
                                type: 'list',
                                title: 'New Collectible',
                                iconUrl: scan.img,
                                message: "",
                                items: [{
                                    title: scan.name,
                                    message: ""
                                }, {
                                    title: scan.cash + scan.type + ' cash',
                                    message: "",
                                }, {
                                    title: "",
                                    message: ""
                                }],
                                buttons: [{
                                    title: 'Purchase Item'
                                }]
                            });
                        } else if (scan.coins.length > 0 && parseInt(scan.coins) > 0) {
                            chrome.notifications.create('new', {
                                type: 'list',
                                title: 'New Collectible',
                                iconUrl: scan.img,
                                message: "",
                                items: [{
                                    title: scan.name,
                                    message: ""
                                }, {
                                    title: "",
                                    message: "",
                                }, {
                                    title: scan.coins + ' coins',
                                    message: ""
                                }],
                                buttons: [{
                                    title: 'Purchase Item'
                                }]
                            });
                        }
                        collectible.play();
                        localStorage.setItem('latest', scan.id);

                        chrome.notifications.onButtonClicked.addListener(function(button) {
                            if (button == "new") {
                                chrome.tabs.create({
                                    url: scan.url
                                })
                            }
                        });
                    }
                }
            }
        });
    }, 2000);

}