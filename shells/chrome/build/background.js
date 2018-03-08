chrome.runtime.onMessage.addListener(function (request, sender) {
    // if (request.type == "notification")
    //     chrome.notifications.create('notification', request.options, function() { });
    console.log(request);
});
