module.exports = function() {
    const {execSync} = require('child_process');
    const m = require('../shells/chrome/dist/parcel-manifest.json');
    const hs = m['chrome.tsx'];
    const styles = m['core.scss'];

    execSync(`cp shells/chrome${hs} shells/chrome/dist/panel.js`);
    execSync(`cp shells/chrome${styles} shells/chrome/dist/panel.css`);
}
