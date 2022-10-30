"use strict";

/**********************************************
    * Global variables
**********************************************/
var pseudo;

function updateConnectedUsersList(clients) {
    var list = document.getElementById("content").getElementsByTagName("aside")[0];
        list.innerHTML = "";

    for (var i = 0; i < clients.length; i++) {
        var p = document.createElement("p");
        p.textContent = clients[i];

        p.setAttribute("data-score", 0);

        list.appendChild(p);
    }
}


function checkIfMessageContainsEmojis(message) {
    // some of the most popular emojis
    var emojis = {
        ":joy:": "😂",
        ":heart:": "❤️",
        ":rofl:": "🤣",
        ":thumbsup:": "👍",
        ":sob:": "😭",
        ":pray:": "🙏",
        ":kissing_heart:": "😘",
        ":smiling_face_with_3_hearts:": "🥰",
        ":heart_eyes:": "😍",
        ":blush:": "😊",
        ":tada:": "🎉",
        ":grin:": "😁",
        ":two_hearts:": "💕",
        ":pleading_face:": "🥺",
        ":sweat_smile:": "😅",
        ":fire:": "🔥",
        "person_facepalming:": "🤦",
        ":shrug:": "🤷",
        ":rolling_eyes:": "🙄",
        ":hugging:": "🤗",
        ":winking:": "😉",
        ":birthday:": "🎂",
        ":thinking:": "🤔",
        ":clapping:": "👏",
        ":slight_smile:": "🙂",
        ":flushed:": "😳",
        ":partying:": "🥳",
        ":sunglasses:": "😎",
        ":ok_hand:": "👌",
        ":purple_heart:": "💜",
        ":pensive:": "😔",
        ":muscle:": "💪",
        ":sparkles:": "✨",
        ":sparkling_heart:": "💖",
        ":eyes:": "👀",
        ":yum:": "😋",
        ":smirk:": "😏",
        ":crying:": "😢",
        ":backhand_right:": "👉",
        ":growing_heart:": "💗",
        ":weary:": "😩",
        ":hundred_points:": "💯",
        ":rose:": "🌹",
        ":revolving_hearts:": "💞",
        ":balloon:": "🎈",
        ":blue_heart:": "💙",
        ":happy:": "😃",
        ":angry:": "😠",
        ":bouquet:": "💐",
        ":stuck_out_tongue:": "😛",
        ":see_no_evil:": "🙈",
        ":crossed_fingers:": "🤞",
        ":drooling:": "🤤",
        ":raised_hands:": "🙌",
        ":zan:": "🤪",
        ":broken_heart:": "💔",
        ":relieved:": "😌",
        ":kiss_mark:": "💋",
        ":skull:": "💀",
        ":backhand_down:": "👇",
        ":upside_down:": "🙃",
        ":grimacing:": "😬",
        ":sleeping:": "😴",
        ":scream:": "😱",
        ":neutral:": "😐",
        ":devil:": "😈",
        ":victory:": "✌",
        ":confetti:": "🎊",
        ":disappointed:": "😞",
        ":kissing_closed_eyes:": "😚",
        ":poop:": "💩",
        ":check_mark:": "✅",
        ":hot_face:": "🥵"
    }

    // now check if message contains any emoji
    for (var emoji in emojis) {
        if (message.indexOf(emoji) !== -1) {
            message = message.replace(emoji, emojis[emoji]);
        }
    }

    return message;
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

document.addEventListener("DOMContentLoaded", function(_e) {

    // socket opened to client
    var sock = io.connect();

    // At start : force to display login form
    document.getElementById("radio1").checked = true;
    document.getElementById("pseudo").focus();


    /**********************************************
     * Login
     *********************************************/

    // When the user clicks on the button "Login"
    document.getElementById("btnConnect").addEventListener("click", function(e) {
        pseudo = document.getElementById("pseudo").value;
        if (pseudo != "") {
            sock.emit("login", pseudo);
        }
    });

    // handle login errors
    sock.on("error-connection", function(msg) {
        alert(msg);
    });

    
    /**********************************************
     * Connected users list
     *********************************************/

    // get list when we are connected, and display chat ui
    sock.on("welcome", function(clients) {
        document.getElementById("radio2").checked = true;

        updateConnectedUsersList(clients);
    });

    // update list when a new user is connected
    sock.on("list", function(clients) {
        updateConnectedUsersList(clients);
    });


    /**********************************************
     * Display messages
     *********************************************/

    sock.on("message", function(msg) {
        var p = document.createElement("p");

        p.textContent = timestampToTime(msg.date) + " - ";

        if (msg.from != null) {
            p.textContent += msg.from;

            if (msg.to != null) { // private message
                p.textContent += " [private]";
                p.className = "pm";
            }

            if (msg.from == pseudo) { // my message
                p.className = "me";
            }
        }
        else { // system message
            p.textContent += " [admin]";
            p.className = "system";
        }

        p.textContent += " : " + msg.text;
        document.getElementsByTagName("main")[0].appendChild(p);
    });

    /**********************************************
     * Send messages
     *********************************************/

    // When the user clicks on the button "Send"
    document.getElementById("btnSend").addEventListener("click", function(e) {
        var textInput = document.getElementById("myMessage");
        if (textInput.value != "") {

            // if the message is a private message, it starts with a @pseudo
            var to = textInput.value.match(/^@(\w+)/);

            if (to != null) {
                to = to[1];
                textInput.value = textInput.value.replace(/^@\w+/, "");
            }

            sock.emit("message", { to: to, text: checkIfMessageContainsEmojis(textInput.value) });
            textInput.value = "";
        }
    });
});
    