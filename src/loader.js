local_debug = false;
/** chrome api */
function getExtURL(url) { return chrome.extension.getURL(url); }
function addScript(src, onload) {
    var script = document.createElement("script");
    script.onload = onload;
    script.src = src;
    (document.head||document.documentElement).appendChild(script);
}
function addExtJS(file, onload) { addScript(getExtURL(file), onload); }
function loadShell(cb) {  addExtJS("/js/gz/r"+rev+"/shell.js", cb); }
function loadCommon(cb) { addExtJS("/js/gz/r"+rev+"/CommonCoreModule.js", cb); }
function loadGroup(cb) { addExtJS("/js/gz/r"+rev+"/Group.js", cb); }
function loadCommonMods(cb) {
    if(local_debug)
        addExtJS("mods.js", cb);
    else
        addScript("https://rawgit.com/EduardoRFS/ChatangoExpansion/master/src/mods.js", cb)
}
function loadPmModule(cb) { addExtJS("/js/gz/r"+rev+"/PmModule.js", cb); }
function start_generic(div_name, script_name) {
    var div = document.createElement("div");
    div.id = div_name;
    document.body.appendChild(div);
    var script = document.createElement("script");
    script.src = script_name;
    script.id = 'starter';
    chrome.runtime.sendMessage({method: 'getBlacklist'}, function(blacklist) {
        chrome.runtime.sendMessage({method: 'isAnon'}, function(anon) {
            script.setAttribute('blacklist', blacklist);
            script.setAttribute('anon_state', anon);
            (document.head || document.documentElement).appendChild(script);
        });
    });
}
function start_id(cb) {
    if(local_debug)
        start_generic("cgroup", getExtURL("start_id.js"));
    else
        start_generic("cgroup", "https://rawgit.com/EduardoRFS/ChatangoExpansion/master/src/start_id.js");
}
function start_ipmd(cb) {
    if(local_debug)
        start_generic("cpm", getExtURL("start_ipmd.js"));
    else
        start_generic("cpm", "https://rawgit.com/EduardoRFS/ChatangoExpansion/master/src/start_ipmd.js");
}
function rewriteFrame() {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    var style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = "/styles/grp.css";
    (document.head || document.documentElement).appendChild(style);
    var req = new XMLHttpRequest();
    req.open('GET', getExtURL('/cfg/nc/r.json'));
    req.onload = function() {
        rev = JSON.parse(this.responseText).r;
        console.log('r'+rev);
        window.parent.postMessage(JSON.stringify({cmd: 'getFrameType'}), "*")
        window.addEventListener('message', onMessage);
    };
    req.send();
}
function onMessage(event) {
    try {
        var data = JSON.parse(event.data);
    } catch(err) {
        var data = '';
    }
    if (data.cmd == 'startChat') {
        chat = document.location.hostname.split(".")[0];
        var metas = [].slice.call(document.getElementsByTagName("meta"));
        metas.forEach(function(meta) {
            if (meta.property == "og:title")
                chat = meta.content;
        });
        ifr = document.getElementsByTagName("iframe")[0];
        document.body.style.display = 'initial';
        ifr.contentWindow.postMessage('{"chatango_cmd":"cid","payload":{"fid":"337110123456790","cid":"cid0123456790_","height":"100%","width":"100%","loc":"http://'+chat+'.chatango.com",\n\
        "window":{"width":1318,"height":993},"handle":"'+chat+'","styles":{"b":100,"v" :0,"w":0,"ac":1},"expandedButton":false}}', '*');
    } else if (data.cmd == 'startPVT') {
        chat = document.location.hostname.split(".")[0];
        ifr = document.getElementsByTagName("iframe")[0];
        document.body.style.display = 'initial';
        ifr.contentWindow.postMessage('{"chatango_cmd":"cid","payload":{"fid":"cf07610123456790","cid":"cid0123456790_","height":"100%","width":"100%","loc":"http://'+chat+'.chatango.com/?js","window":{"width":1318,"height":993},' +
            '"handle":"'+chat+'","styles":'+JSON.stringify(JSON.parse(script_handler).styles)+',"expandedButton":false}}', '*');
    } else if (data.cmd == 'startChatLoad') {
        loadShell(function() {
            loadCommon(function() {
                loadGroup(function() {
                    loadCommonMods(function() {
                        start_id();
                    });
                });
            });
        });
    } else if (data.cmd == 'startPVTLoad') {
        loadShell(function() {
            loadCommon(function() {
                loadPmModule(function() {
                    loadCommonMods(function() {
                        start_ipmd();
                    });
                });
            });
        });
    } else if (data.cmd == 'getFrameType') {
        ifr = document.getElementsByTagName("iframe")[0];
        if (frametype == 'chat') ifr.contentWindow.postMessage(JSON.stringify({cmd: 'startChatLoad'}), "*");
        else if (frametype == 'pvt') ifr.contentWindow.postMessage(JSON.stringify({cmd: 'startPVTLoad'}), "*");
    } else if (data.cmd == 'refreshPage') {
        rewritePage();
    }
}
function rewritePage(type) {
    frametype = type;
    script_handler = document.getElementById("cid0123456790_").innerHTML;
    console.log("Rewriting page.");
    window.addEventListener('message', onMessage);
    document.onreadystatechange = null;
    document.body.innerHTML = '';
    var ifr = document.createElement("iframe");
    ifr.src = 'http://st.chatango.com//styles/grp.css';
    ifr.width = '100%';
    ifr.height = '100%';
    ifr.style.border = "0px";
    document.body.appendChild(ifr);
}
/** chrome api */
chrome.runtime.sendMessage({method: 'isEnable'}, function(running) {
    if(!running) return;
    if (document.location.pathname == "//styles/grp.css") rewriteFrame();
    else {
        if (document.getElementsByTagName("table")[0]) {
            if (document.getElementsByTagName("table")[0].id == "group_table") {
                document.body.style.display = 'none';
                document.body.style.margin = '0px';
                document.onreadystatechange = function() {
                    rewritePage('chat');
                };
            } else if(document.getElementsByTagName("table")[0].id == "main_table") {
                document.body.style.display = 'none';
                document.body.style.margin = '0px';
                document.onreadystatechange = function () {
                    rewritePage('pvt');
                };
            }
        }
    }
});