/** chrome api */
function getStorage(key, cb) {
    chrome.storage.local.get(key, function(res) { if(cb) cb(res[key]); });
}
/** chrome api */
function setStorage(key, value, cb) {
    var option = {};
    option[key] = value;
    chrome.storage.local.set(option, function(){ if(cb) cb(); });
}
function isEnable(cb) {
    getStorage('running', function(running) {
        if (running === undefined) {
            running = true;
            setEnabled(true); // default state
        }
        if(cb) cb(running);
    });
}
function setEnabled(running, cb) {
    setStorage('running', running, cb);
}
function getBlacklist(cb) {
    getStorage('blacklist', function(blacklist) {
        if (blacklist === undefined) {
            blacklist = [];
            setStorage('blacklist', blacklist);
        }
        if(cb) cb(blacklist)
    });
}
function addBlacklist(name, cb) {
    name = name.toLowerCase();
    getBlacklist(function(blacklist) {
        if (blacklist.indexOf(name) == -1)
            blacklist.push(name);
        setStorage('blacklist', blacklist, cb);
    });
}
function removeBlacklist(name, cb) {
    name = name.toLowerCase();
    getBlacklist(function(blacklist) {
        if (blacklist.indexOf(name) > -1)
            blacklist.splice(blacklist.indexOf(name), 1);
        setStorage('blacklist', blacklist, cb);
    });
}
function isAnon(cb) {
    getStorage('anon_state', function(anon_state) {
        if (anon_state === undefined) {
            anon_state = false;
            setAnon(false); // default state
        }
        if(cb) cb(anon_state);
    });
}
function setAnon(state, cb) {
    setStorage('anon_state', state, cb);
}
/** chrome api */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.method == "isEnable") isEnable(function(enabled) { sendResponse(enabled); });
    if(message.method == "getBlacklist") getBlacklist(function(blacklist) { sendResponse(blacklist); });
    if(message.method == "isAnon") isAnon(function(anon) { sendResponse(anon); });
    return true;
});