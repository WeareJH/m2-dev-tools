declare var chrome;
chrome.devtools.panels.create('M2', '', 'panel.html', function (panel) {
    var reactPanel = null;
    panel.onShown.addListener(function (window) {
        // when the user switches to the panel, check for an elements tab
        // selection
        window.panel.getNewSelection();
        reactPanel = window.panel;
        reactPanel.resumeTransfer();
    });
    panel.onHidden.addListener(function () {
        if (reactPanel) {
            reactPanel.hideHighlight();
            reactPanel.pauseTransfer();
        }
    });
});
