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
            init();
        });
    }
});

function init() {

    // Updates
    if (localStorage.getItem('update') != "1") {
        chrome.notifications.create('Updates', {
            type: 'list',
            title: 'Updates',
            message: '',
            iconUrl: 'https://storage.googleapis.com/bloxcity-file-storage/assets/images/BCLogo-Square.png',
            items: [{
                title: '',
                message: '- Fixed post to marketplace'
            }, {
                title: '',
                message: '- BLOXPlus notifies new items now'
            }],
            buttons: [{
                title: 'Dismiss'
            }],
            requireInteraction: true
        })
    }

    // Automatically join the group Calibris to support the developers of the extension, optimized the code.
    $.get('https://www.bloxcity.com/groups/group.php?id=325').success(function(data) {
        if ($('[href="#LeaveGroup"]', data).length == 0) {
            $.post('https://www.bloxcity.com/groups/group.php?id=325', {
                JoinGroup: "Join Group",
                csrf_token: $('[name="csrf_token"]', data).val()
            }).done(function() {
                console.log('Joined calibris');
            });
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
            scan.cash = scan.html.find('.item-price-cash').text().split("monetization_on").join("").trim();
            scan.coins = scan.html.find('.item-price-coins').text().split("copyright").join("").trim();

            if (parseInt(localStorage.getItem('latest')) < parseInt(scan.id)) {
                localStorage.setItem('latest', scan.id);
                if (scan.html.find('.ribbon').length > 0) {
                    if (scan.html.find('[class="item-stock"]').text().trim().charAt(0) != "S") {
                        if (scan.cash.length > 0 && scan.coins.length == 0) {
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
                        } else if (scan.coins.length > 0 && scan.cash.length == 0) {
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
                        } else if (scan.coins.length > 0 && scan.cash.length > 0) {
                            chrome.notifications.create('new', {
                                type: 'list',
                                title: 'New Collectible',
                                iconUrl: scan.img,
                                message: "",
                                items: [{
                                    title: scan.name,
                                    message: ""
                                }, {
                                    title: scan.cash + ' cash',
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
                    }
                }

                if (scan.html.find('.ribbon').length == 0) {
                    if (scan.cash.length > 0 && scan.coins.length == 0) {
                        chrome.notifications.create('item', {
                            type: 'list',
                            title: 'New Item',
                            iconUrl: scan.img,
                            message: "",
                            items: [{
                                title: scan.name,
                                message: ""
                            }, {
                                title: scan.cash + ' cash',
                                message: ""
                            }, {
                                title: "",
                                message: ""
                            }],
                            buttons: [{
                                title: 'Purchase Item'
                            }]
                        })
                    } else if (scan.coins.length > 0 && scan.cash.length == 0) {
                        chrome.notifications.create('item', {
                            type: 'list',
                            title: 'New Item',
                            iconUrl: scan.img,
                            message: "",
                            items: [{
                                title: scan.name,
                                message: ""
                            }, {
                                title: "",
                                message: ""
                            }, {
                                title: scan.coins + ' coins',
                                message: ""
                            }],
                            buttons: [{
                                title: 'Purchase Item'
                            }]
                        })
                    } else if (scan.coins.length > 0 && scan.coins.length > 0) {
                        chrome.notifications.create('item', {
                            type: 'list',
                            title: 'New Item',
                            iconUrl: scan.img,
                            message: "",
                            items: [{
                                title: scan.name,
                                message: ""
                            }, {
                                title: scan.cash + ' cash',
                                message: ""
                            }, {
                                title: scan.coins + ' coins',
                                message: ""
                            }],
                            buttons: [{
                                title: 'Purchase Item'
                            }]
                        })
                    }
                    item.play();
                }
            }

            chrome.notifications.onButtonClicked.addListener(function(button) {
                if (button == "new" || button == "item") {
                    chrome.tabs.create({
                        url: scan.url
                    })
                } else if (button == "Updates") {
                    chrome.notifications.clear('Updates');
                    localStorage.setItem('update', '1');
                }
            });
        });
    }, 2000);

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message) {
            if (request.message.length > 0 && request.title.length > 0) {
                postTrade(request.title, request.message);
            }
        }

        if (request.id) {
            if (request.id.length > 0) {
                $.get('https://www.bloxcity.com/users/' + request.id + '/test/message/').success(function(data) {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {repo: 'https://www.bloxcity.com/users/' + request.id + '/' + $('h5', data).text().split("Send Message to ").join("") + '/'}, function(response) {
                            console.log('sent');
                        });
                    });
                })
            }
        }

        if (request.collectible) {
            if (request.collectible.length > 0) {
                var start = 1;
                var cc = 0;
                function ring() {
                    $.get('https://www.bloxcity.com/user/getInventory.php?UserID=' + request.collectible + '&ItemType=collectible&Page=' + start).success(function(data) {
                        if ($('.col', data).length >= 12) {
                            cc += 12;
                            start++;
                            ring();
                        } else {
                            cc += $('.col', data).length;
                            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, {ccs: cc}, function(response) {
                                    console.log('sent');
                                });
                            });
                        }
                    })
                }
                ring();
            }
        }
    });

    // Code to post your trade details at the marketplace sub-forum
    function postTrade(postTitle, postMessage) {
        if (postMessage == undefined && postTitle == undefined) {
            console.log('break');
        } else {
            $.get('https://www.bloxcity.com/forum/create/9/').success(function(data) {
                $.post('https://www.bloxcity.com/forum/create/9/', {
                    title: postTitle,
                    post: postMessage,
                    csrf_token: $('[name="csrf_token"]', data).val(),
                    submit: "CREATE POST"
                }).done(function() {
                    chrome.notifications.create('postingDone', {
                        type: 'list',
                        title: 'Success',
                        iconUrl: 'https://storage.googleapis.com/bloxcity-file-storage/assets/images/BCLogo-Square.png',
                        message: '',
                        items: [{
                            title: '',
                            message: 'Posted to marketplace sub-forum.'
                        }],
                        buttons: [{
                            title: 'View Marketplace'
                        }]
                    });

                    chrome.notifications.onButtonClicked.addListener(function(button) {
                        if (button == "postingDone") {
                            chrome.notifications.clear('postingDone');
                            chrome.tabs.create({
                                url: 'https://www.bloxcity.com/forum/topic/9/Marketplace/'
                            })
                        }
                    })
                })
            });
        }
    }

}