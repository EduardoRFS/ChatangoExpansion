var http = require('http');
var zlib = require('zlib');
var fs = require('fs');
var mkdirp = require('mkdirp');

var hostname = 'st.chatango.com';
var rev = '';
var base_chattanga = 'dev2.chattanga.com';
var chattangas = ['sclarkson', 'josh', 'alecm'];

function readData(path, callback) {
    var chunks = [];
    var options = {
        hostname: hostname,
        path: "/"+path
    };
    http.get(options, function(res) {
        res.on('data', function(chunk) {
            chunks.push(chunk);
        });
        res.on('end', function() {
            var buffer = Buffer.concat(chunks);
            var encoding = res.headers['content-encoding'];
            zlib.create
            if (encoding == 'gzip') {
                zlib.gunzip(buffer, function(err, decoded) {
                    if (err) throw err;
                    callback(decoded && decoded.toString());
                });
            } else if (encoding == 'deflate') {
                zlib.inflate(buffer, function(err, decoded) {
                    if (err) throw err;
                    callback(decoded && decoded.toString());
                })
            } else {
                callback( buffer.toString());
            }
        });
    });
}
function readJSON(path, cb) {
    readData(path, function(res) {
        if(cb) cb(JSON.parse(res.toString()));
    });
}
function downloadFile(path, cb) {
    var directory = ("src/"+path).split('/');
    directory = directory.slice(0, directory.length-1);
    directory = directory.join('/');
    mkdirp.sync(directory);
    readData(path, function(data) {
        fs.writeFile("src/"+path, data, {
            flag: 'w'
        }, function(err) {
            if(err) throw err;
            console.log("Downloaded file: "+path);
        });
    })
}
function downloadLang(name, cb) {
    downloadFile('lang-xml/' + name + '.xml');
}
function getRev(cb) {
    readJSON("/cfg/nc/r.json", function(res) {
        rev = res.r;
        fs.writeFileSync("src/cfg/nc/r.json", JSON.stringify(res));
        cb(rev);
    });
}
function getChattanga(cb) {
    hostname = 'st.chatango.com';
    getRev(function() {
        readData('/h5/gz/r'+rev+'/id.html', function(res) {
            chattangas.forEach(function(owner) {
                if(res.indexOf('"'+owner+'"') > -1)
                    hostname = 'st.'+owner+'.'+base_chattanga;
            });
            getRev(function() {
                cb(hostname);
            });
        });
    });
}
function downloadModules() {
    readData('/js/gz/r'+rev+'/shell.js', function(data) {
        var start = data.indexOf('chatango.group.moduleInfo.MODULE_URIS =');
        data = data.substring(start);
        var end = data.indexOf('goog.require("goog.events.Event");');
        data = data.substring(0, end);
        if(data) {
            eval(data.replace('chatango.group.moduleInfo.', 'var ').replace(/chatango\.group\.moduleInfo\.modulePrefix_\ \+\ /g, ''));
            for (var key in MODULE_URIS) {
                downloadFile('js/gz/r'+rev+'/'+key+'.js');
            }
        }
    });
}
getChattanga(function() {
    downloadModules();
    downloadFile('js/gz/emb_fullsize.js');
    downloadFile('pcache/sounds/reply_notification.mp3');
    downloadFile('pcache/sounds/message_received.ogg');
    downloadFile('styles/grp.css');
    downloadLang('ui_pt');
    downloadLang('msgcatcher_pt');
    downloadLang('basic_group_pt');
    downloadLang('date_time_pt');
    downloadFile('h5/gz/r'+rev+'/id.html');
});