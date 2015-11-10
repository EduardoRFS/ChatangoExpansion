/*                         MODS                          */
//see counter on all chats
function allSeeCounter() {
    chatango.group.GroupInfo.prototype.getShowCounter = function () {
        return true;
    };
}
allSeeCounter();
//blacklist functions
function userFilter(event) {
    var msg =  new chatango.messagedata.GroupMessageData(event.message);
    var user = msg.name_.toLowerCase();
    console.log(user);
    if (msg.userType_ != chatango.users.User.UserType.SELLER && anon_state)
        return true;
    if(user == "EduardoRFS".toLowerCase())
        return false;
    for (i = 0;i < blacklist.length; i++)
        if (blacklist[i].toLowerCase() == user)
            return true;
    return false;
}
function enableBlacklist() {
    chatango.networking.GroupConnection.prototype.onData = function(event) {
        var arr = event.message.split("\r\n")[0].split(":");
        if (arr[0] != "n") {
            if (chatango.DEBUG) {
                console.log("Group Con. ON DATA: " + event.message);
            }
        } else {
            var ts = (new Date).getTime();
            if (!this.lastNTime_ || ts - this.lastNTime_ > 500) {
                this.lastNTime_ = ts;
            } else {
                return;
            }
        }
        var cmd_type = "group";
        var e_name = chatango.networking.GroupConnectionEvent.EventLookup[arr[0]];
        if (!e_name) {
            e_name = chatango.networking.CommonConnectionEvent.EventLookup[arr[0]];
            cmd_type = "common";
        }
        if (!e_name) {
            if (chatango.DEBUG) {
                if (arr.toString() == "") {
                    this.logger.info("PING FROM SERVER");
                } else {
                    this.logger.info("Unhandled command:" + arr);
                }
            }
            return;
        }
        if (arr.length == 2 && arr[1] == "") {
            arr = [arr[0]];
        }
        if (e_name == chatango.networking.GroupConnectionEvent.EventType.groupflagsupdate) {
            this.flags = arr[1];
            chatango.users.ModeratorManager.getInstance().changeModVisibility(this.flags);
        }
        if (cmd_type == "group") {
            if (chatango.DEBUG) {
                this.logger.info("dispatch Group ConnectionEvent:" + e_name);
            }
            if (e_name == chatango.networking.GroupConnectionEvent.EventType.i || e_name == chatango.networking.GroupConnectionEvent.EventType.b) {
                if(userFilter(event)) return;
                var msg = new chatango.messagedata.GroupMessageData(event.message);
                if (msg.isValidMessage()) {
                    this.dispatchEvent(new chatango.networking.GroupConnectionEvent(e_name, msg));
                } else {
                    if (chatango.DEBUG) {
                        this.logger.info("THIS GROUP MESSAGE IS MALFORMATTED - DO NOT CONTINUE");
                    }
                    return;
                }
            } else {
                if (e_name == chatango.networking.GroupConnectionEvent.EventType.annc) {
                    var msg = new chatango.messagedata.GroupAnnouncementData(event.message);
                    var formatter = new chatango.messagedata.GroupMsgFormatter(msg);
                    var valid = formatter.isValidMessage();
                    if (valid) {
                        this.dispatchEvent(new chatango.networking.GroupConnectionEvent(e_name, msg));
                    } else {
                        if (chatango.DEBUG) {
                            this.logger.info("THIS GROUP ANNC IS MALFORMATTED - DO NOT CONTINUE");
                        }
                        return;
                    }
                } else {
                    this.myevent = new chatango.networking.GroupConnectionEvent(e_name, arr);
                    this.dispatchEvent(this.myevent);
                }
            }
        } else {
            if (chatango.DEBUG) {
                this.logger.info("dispatch Common ConnectionEvent:" + e_name);
            }
            this.dispatchEvent(new chatango.networking.CommonConnectionEvent(e_name, arr));
        }
        if (e_name == chatango.networking.GroupConnectionEvent.EventType.n) {
            this.numUsers_ = arr[1];
        }
    };
}
blacklist = document.getElementById("starter").getAttribute('blacklist').split(',');
anon_state = document.getElementById("starter").getAttribute('anon_state') == 'true';
enableBlacklist();
/*                         /MODS                          */
/*                         START                          */
CLOSURE_NO_DEPS=true;
_chatangoTagserver = {"sw": {"sv10": 110, "sv12": 116, "w12": 75, "sv8": 101, "sv6": 104, "sv4": 110, "sv2": 95}, "ex": {"b55279b3166dd5d30767d68b50c333ab": 21, "0a249c2a3a3dcb7e40dcfac36bec194f": 21, "3ae9453fa1557dc71316701777c5ee42": 51, "ebcd66fd5b868f249c1952af02a91cb3": 5, "4913527f3dd834ec1bb3e1eb886b6d62": 56, "7a067398784395c6208091bc6c3f3aac": 22, "ce7b7bc84a4e8184edb432085883ae04": 51, "fe8d11abb9c391d5f2494d48bb89221b": 8, "2d14c18e510a550f0d13eac7685ba496": 8, "3e772eba0dfbf48d47b4c02d5a3beac9": 56, "eff4fd30f3fa53a4a1cb3442a951ad03": 54, "082baeccd5eabe581cba35bd777b93ef": 56, "e21569f6966d79cfc1b911681182f71f": 34, "0b18ed3fb935c9607cb01cc537ec854a": 10, "20e46ddc5e273713109edf7623d89e7a": 22, "72432e25656d6b7dab98148fbd411435": 70, "bb02562ba45ca77e62538e6c5db7c8ae": 10, "d78524504941b97ec555ef43c4fd9d3c": 21, "2db735f3815eec18b4326bed35337441": 56, "63ff05c1d26064b8fe609e40d6693126": 56, "ec580e6cbdc2977e09e01eb6a6c62218": 69, "246894b6a72e704e8e88afc67e8c7ea9": 20, "028a31683e35c51862adedc316f9d07b": 51, "2b2e3e5ff1550560502ddd282c025996": 27, "e0d3ff2ad4d2bedc7603159cb79501d7": 67, "726a56c70721704493191f8b93fe94a3": 21}, "sm": [["5", "w12"], ["6", "w12"], ["7", "w12"], ["8", "w12"], ["16", "w12"], ["17", "w12"], ["18", "w12"], ["9", "sv2"], ["11", "sv2"], ["12", "sv2"], ["13", "sv2"], ["14", "sv2"], ["15", "sv2"], ["19", "sv4"], ["23", "sv4"], ["24", "sv4"], ["25", "sv4"], ["26", "sv4"], ["28", "sv6"], ["29", "sv6"], ["30", "sv6"], ["31", "sv6"], ["32", "sv6"], ["33", "sv6"], ["35", "sv8"], ["36", "sv8"], ["37", "sv8"], ["38", "sv8"], ["39", "sv8"], ["40", "sv8"], ["41", "sv8"], ["42", "sv8"], ["43", "sv8"], ["44", "sv8"], ["45", "sv8"], ["46", "sv8"], ["47", "sv8"], ["48", "sv8"], ["49", "sv8"], ["50", "sv8"], ["52", "sv10"], ["53", "sv10"], ["55", "sv10"], ["57", "sv10"], ["58", "sv10"], ["59", "sv10"], ["60", "sv10"], ["61", "sv10"], ["62", "sv10"], ["63", "sv10"], ["64", "sv10"], ["65", "sv10"], ["66", "sv10"], ["68", "sv2"], ["71", "sv12"], ["72", "sv12"], ["73", "sv12"], ["74", "sv12"], ["75", "sv12"], ["76", "sv12"], ["77", "sv12"], ["78", "sv12"], ["79", "sv12"], ["80", "sv12"], ["81", "sv12"], ["82", "sv12"], ["83", "sv12"], ["84", "sv12"]]}
var g = new chatango.embed.Shell();
g.setGroupLoaded();
g.startLocalComm();
// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

g.setupAnalytics(ga);
g.performAnalytics(ga);
console.log('startChat');
window.parent.postMessage(JSON.stringify({cmd: 'startChat'}), "*");