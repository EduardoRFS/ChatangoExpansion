local_debug = false;
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
function revAnon() {
    isAnon(function(anon_state) {
        setAnon(!anon_state);
    })
}
function refreshList() {
    document.getElementById("list").innerHTML = '';
    getBlacklist(function(blacklist) {
        blacklist.forEach(function(item) {
            document.getElementById("list").innerHTML += item+"<br>";
        });
    });
}
function refreshAnon() {
    isAnon(function(anon) {
        document.getElementById("anon").checked = anon;
    });
}
function addUser() {
    user = document.getElementsByTagName("input")[0].value;
    addBlacklist(user, function(blacklist) {});
    setTimeout(refreshList, 50);
}
function removeUser() {
    user = document.getElementsByTagName("input")[0].value;
    removeBlacklist(user, function(blacklist) {});
    setTimeout(refreshList, 50);
}
var req = new XMLHttpRequest();
req.onload = function() {
    var parser = new DOMParser();
    var parse = parser.parseFromString(this.responseText, 'text/html');
    var html = document.getElementsByTagName("html")[0];
    document.removeChild(html);
    document.appendChild(parse.children[0]);
    document.getElementById("add").onclick = addUser;
    document.getElementById("remove").onclick = removeUser;
    document.getElementById("anon").onclick = revAnon;
    refreshList();
    refreshAnon();
};
if(local_debug)
    req.open('GET', 'popup.html');
else
    req.open('GET', "https://rawgit.com/EduardoRFS/ChatangoExpansion/master/src/popup.html");
req.send();