(window as any).__shane = true;
// var src = `
//   // the prototype stuff is in case document.createElement has been modified
//   (function () {
//     var script = document.constructor.prototype.createElement.call(document, 'script');
//     script.src = "/shane.js";
//     document.documentElement.appendChild(script);
//     script.parentNode.removeChild(script);
//   })()
//   `;
// declare var chrome;
// chrome.devtools.inspectedWindow.eval(src, function(res, err) {
//     if (err) {
//         console.log(err);
//     }
// });
