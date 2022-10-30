"use strict";

/**********************************************
    * Global variables
**********************************************/
var pseudo;

/**********************************************
    * Chifoumi
**********************************************/
const CHIFOUMI_CHOICES = [':rock:', ':paper:', ':scissors:', ':lizard:', ':spock:'];

function chifoumiRequestParametersValid(adversary, choice) {
  return adversary && choice && adversary[0] === '@' && CHIFOUMI_CHOICES.indexOf(choice) !== -1;
}




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


function replaceEmojisInMessage(message) {
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

    // add emojis required for chifoumi (:rock:, :paper:, :scissors:, :lizard:, :spock:)
    emojis[CHIFOUMI_CHOICES[0]] = "✊";
    emojis[CHIFOUMI_CHOICES[1]] = "🖐";
    emojis[CHIFOUMI_CHOICES[2]] = "✌";
    emojis[CHIFOUMI_CHOICES[3]] = "🦎";
    emojis[CHIFOUMI_CHOICES[4]] = "🖖";

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
    return hours + ':' + minutes.substring(-2) + ':' + seconds.substring(-2);
}

function addMessageToChat(msg) {
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
        else if (msg.opponent != null) { // chifoumi message
            p.textContent += " [chifoumi]";
            p.className = "chifoumi";
        }
        else { // system message
            p.textContent += " [admin]";
            p.className = "system";
        }

        p.textContent += " : " + replaceEmojisInMessage(msg.text);

        if (msg.opponent && msg.sender && msg.sender !== pseudo) { // display the reply button only if I'm not the sender of chifoumi request
            var replyBtn = document.createElement("button");
            replyBtn.textContent = "Reply";

            replyBtn.addEventListener("click", function() {
                var textInput = document.getElementById("myMessage");
                textInput.value = "/chifoumi @" + msg.opponent + " :";
                textInput.focus();
            });
            p.textContent += " ";
            p.appendChild(replyBtn);


            // play the buzz animation
            var chatWindow = document.getElementById("content");
            chatWindow.className = "buzz";
            setTimeout(function() {
                chatWindow.className = "";
            }, 1000);
        }
        document.getElementsByTagName("main")[0].appendChild(p);
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
        addMessageToChat(msg);
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


            // send a chifoumi message if msg starts with /chifoumi
            var chifoumi = textInput.value.match(/^\/chifoumi/);

            if (chifoumi != null) {
                var params = textInput.value.replace(/^\/chifoumi/, "").trim().split(" ");

                if (!chifoumiRequestParametersValid(params[0], params[1])) {
                    // send an error message to the user
                    addMessageToChat({
                        opponent: "admin",
                        text: "Invalid chifoumi request. Usage: /chifoumi @adversary :choice: (choice can be :rock:, :paper:, :scissors:, :lizard: or :spock:)",
                        date: Date.now()
                    });
                    return;
                }

                sock.emit("chifoumi-message", {to: params[0], choice: params[1]});

                textInput.value = "";
                return;
            }

            sock.emit("message", { to: to, text: textInput.value });
            textInput.value = "";
        }
    });

    
    /**********************************************
     * Chifoumi
    **********************************************/

    sock.on("chifoumi-message", function(msg) {
        addMessageToChat(msg);
    });
});
    