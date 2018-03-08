chrome.runtime.onMessage.addListener(function(request, sender) {
    // if (request.type == "notification")
    //     chrome.notifications.create('notification', request.options, function() { });
    // chrome.runtime.sendMessage({name: 'shane'});
    console.log(request);
});

