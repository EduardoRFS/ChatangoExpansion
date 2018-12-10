local_debug = false;
/** chrome api */
function getExtURL(url) { return chrome.extension.getURL(url); }
function addScript(src, onload) {
    var script = document.createElement("script");
    script.onload = onload;
    script.src = src;
    (document.head||document.documentElement).appendChild(script);
}
if(local_debug)
    addScript("popup.js", function(){});
else
    addScript("https://cdn.jsdelivr.net/gh/EduardoRFS/ChatangoExpansion@master/src/popup.js", function(){})