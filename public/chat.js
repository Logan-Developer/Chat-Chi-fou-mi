"use strict";

/**********************************************
    * Global variables
**********************************************/
var pseudo;

var CHIFOUMI_CHOICES = [":rock:", ":paper:", ":scissors:", ":lizard:", ":spock:"];

var commandsHistory = [];
var commandsHistoryIndex = 0;

var emojiToComplete = null;
var currEmojiIndex = 0;

// list of emojis taken from https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md#github-custom-emoji
// (not complete)
var emojis = {
    ":grinning:": "😀",
    ":smiley:": "😃",
    ":smile:": "😄",
    ":grin:": "😁",
    ":laughing:": "😆",
    ":satisfied:": "😆",
    ":sweat_smile:": "😅",
    ":rofl:": "🤣",
    ":joy:": "😂",
    ":slightly_smiling_face:": "🙂",
    ":upside_down_face:": "🙃",
    ":wink:": "😉",
    ":blush:": "😊",
    ":innocent:": "😇",
    ":smiling_face_with_three_hearts:": "🥰",
    ":heart_eyes:": "😍",
    ":star_struck:": "🤩",
    ":kissing_heart:": "😘",
    ":kissing:": "😗",
    ":kissing_closed_eyes:": "😚",
    ":kissing_smiling_eyes:": "😙",
    ":smiling_face_with_tear:": "🥲",
    ":yum:": "😋",
    ":stuck_out_tongue:": "😛",
    ":stuck_out_tongue_winking_eye:": "😜",
    ":zany_face:": "🤪",
    ":stuck_out_tongue_closed_eyes:": "😝",
    ":money_mouth_face:": "🤑",
    ":hugs:": "🤗",
    ":hand_over_mouth:": "🤭",
    ":shushing_face:": "🤫",
    ":thinking:": "🤔",
    ":zipper_mouth_face:": "🤐",
    ":raised_eyebrow:": "🤨",
    ":neutral_face:": "😐",
    ":expressionless:": "😑",
    ":no_mouth:": "😶",
    ":smirk:": "😏",
    ":unamused:": "😒",
    ":roll_eyes:": "🙄",
    ":grimacing:": "😬",
    ":face_exhaling:": "😮‍💨",
    ":lying_face:": "🤥",
    ":relieved:": "😌",
    ":pensive:": "😔",
    ":sleepy:": "😪",
    ":drooling_face:": "🤤",
    ":sleeping:": "😴",
    ":mask:": "😷",
    ":face_with_thermometer:": "🤒",
    ":face_with_head_bandage:": "🤕",
    ":nauseated_face:": "🤢",
    ":vomiting_face:": "🤮",
    ":sneezing_face:": "🤧",
    ":hot_face:": "🥵",
    ":cold_face:": "🥶",
    ":woozy_face:": "🥴",
    ":dizzy_face:": "😵",
    ":exploding_head:": "🤯",
    ":cowboy_hat_face:": "🤠",
    ":partying_face:": "🥳",
    ":disguised_face:": "🥸",
    ":sunglasses:": "😎",
    ":nerd_face:": "🤓",
    ":monocle_face:": "🧐",
    ":confused:": "😕",
    ":worried:": "😟",
    ":slightly_frowning_face:": "🙁",
    ":frowning_face:": "☹️",
    ":open_mouth:": "😮",
    ":hushed:": "😯",
    ":astonished:": "😲",
    ":flushed:": "😳",
    ":pleading_face:": "🥺",
    ":frowning:": "😦",
    ":anguished:": "😧",
    ":fearful:": "😨",
    ":cold_sweat:": "😰",
    ":disappointed_relieved:": "😥",
    ":cry:": "😢",
    ":sob:": "😭",
    ":scream:": "😱",
    ":confounded:": "😖",
    ":persevere:": "😣",
    ":disappointed:": "😞",
    ":sweat:": "😓",
    ":weary:": "😩",
    ":tired_face:": "😫",
    ":yawning_face:": "🥱",
    ":triumph:": "😤",
    ":pout:": "😡",
    ":rage:": "😠",
    ":angry:": "😠",
    ":cursing_face:": "🤬",
    ":smiling_imp:": "😈",
    ":imp:": "👿",
    ":skull:": "💀",
    ":skull_and_crossbones:": "☠️",
    ":hankey:": "💩",
    ":poop:": "💩",
    ":shit:": "💩",
    ":clown_face:": "🤡",
    ":japanese_ogre:": "👹",
    ":japanese_goblin:": "👺",
    ":ghost:": "👻",
    ":alien:": "👽",
    ":space_invader:": "👾",
    ":robot:": "🤖",
    ":smiley_cat:": "😺",
    ":smile_cat:": "😸",
    ":joy_cat:": "😹",
    ":heart_eyes_cat:": "😻",
    ":smirk_cat:": "😼",
    ":kissing_cat:": "😽",
    ":scream_cat:": "🙀",
    ":crying_cat_face:": "😿",
    ":pouting_cat:": "😾",
    ":see_no_evil:": "🙈",
    ":hear_no_evil:": "🙉",
    ":speak_no_evil:": "🙊",
    ":kiss:": "💋",
    ":love_letter:": "💌",
    ":cupid:": "💘",
    ":gift_heart:": "💝",
    ":sparkling_heart:": "💖",
    ":heartpulse:": "💗",
    ":heartbeat:": "💓",
    ":revolving_hearts:": "💞",
    ":two_hearts:": "💕",
    ":heart_decoration:": "💟",
    ":heavy_heart_exclamation:": "❣️",
    ":broken_heart:": "💔",
    ":heart:": "❤️",
    ":orange_heart:": "🧡",
    ":yellow_heart:": "💛",
    ":green_heart:": "💚",
    ":blue_heart:": "💙",
    ":purple_heart:": "💜",
    ":brown_heart:": "🤎",
    ":black_heart:": "🖤",
    ":white_heart:": "🤍",
    ":100:": "💯",
    ":anger:": "💢",
    ":boom:": "💥",
    ":collision:": "💥",
    ":dizzy:": "💫",
    ":sweat_drops:": "💦",
    ":dash:": "💨",
    ":hole:": "🕳️",
    ":bomb:": "💣",
    ":speech_balloon:": "💬",
    ":eye_speech_bubble:": "👁️‍🗨️",
    ":left_speech_bubble:": "🗨️",
    ":right_anger_bubble:": "🗯️",
    ":thought_balloon:": "💭",
    ":zzz:": "💤",
    ":wave:": "👋",
    ":raised_back_of_hand:": "🤚",
    ":raised_hand_with_fingers_splayed:": "🖐️",
    ":hand:": "✋",
    ":raised_hand:": "✋",
    ":vulcan_salute:": "🖖",
    ":ok_hand:": "👌",
    ":pinched_fingers:": "🤌",
    ":pinching_hand:": "🤏",
    ":v:": "✌️",
    ":crossed_fingers:": "🤞",
    ":love_you_gesture:": "🤟",
    ":metal:": "🤘",
    ":call_me_hand:": "🤙",
    ":point_left:": "👈",
    ":point_right:": "👉",
    ":point_up_2:": "👆",
    ":fu:": "🖕",
    ":middle_finger:": "🖕",
    ":point_down:": "👇",
    ":point_up:": "☝️",
    ":thumbsup:": "👍",
    ":thumbsdown:": "👎",
    ":fist:": "✊",
    ":fist_raised:": "✊",
    ":facepunch:": "👊",
    ":fist_oncoming:": "👊",
    ":punch:": "👊",
    ":fist_left:": "🤛",
    ":fist_right:": "🤜",
    ":clap:": "👏",
    ":raised_hands:": "🙌",
    ":open_hands:": "👐",
    ":palms_up_together:": "🤲",
    ":handshake:": "🤝",
    ":pray:": "🙏",
    ":writing_hand:": "✍️",
    ":nail_care:": "💅",
    ":selfie:": "🤳",
    ":muscle:": "💪",
}

// add emojis required for chifoumi (:rock:, :paper:, :scissors:, :lizard:, :spock:)
emojis[CHIFOUMI_CHOICES[0]] = "✊";
emojis[CHIFOUMI_CHOICES[1]] = "🖐";
emojis[CHIFOUMI_CHOICES[2]] = "✌";
emojis[CHIFOUMI_CHOICES[3]] = "🦎";
emojis[CHIFOUMI_CHOICES[4]] = "🖖";

/**********************************************
    * Chifoumi
**********************************************/
function chifoumiRequestParametersValid(adversary, choice) {
  return adversary && choice && adversary[0] === '@' && CHIFOUMI_CHOICES.indexOf(choice) !== -1;
}




function updateConnectedUsersList(list) {
    var aside = document.getElementById("content").getElementsByTagName("aside")[0];
    aside.innerHTML = "";

    // the user with most points is displayed first
    list.clients.sort(function (a, b) {
        return list.scores[b] - list.scores[a];
    });

    for (var i = 0; i < list.clients.length; i++) {
        var p = document.createElement("p");
        p.textContent = list.clients[i];

        var score = list.scores[list.clients[i]];

        p.setAttribute("data-score", score ? score : 0);

        p.addEventListener("dblclick", function() {
            var textInput = document.getElementById("myMessage");
            textInput.value = "/chifoumi @" + this.textContent + " :";
            textInput.focus();

            // move cursor to the end of the text
            textInput.selectionStart = textInput.selectionEnd = textInput.value.length;
        });


        aside.appendChild(p);
    }
}


function replaceEmojisInMessage(message) {
    // check if message contains any emoji
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

    return hours + ':' + minutes.substring(minutes.length - 2) + ':' + seconds.substring(seconds.length - 2);
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
     * Logout
     *********************************************/
    document.getElementById("btnQuit").addEventListener("click", function(e) {
        sock.emit("logout");
        document.getElementById("radio1").checked = true;
    });
    
    /**********************************************
     * Connected users list
     *********************************************/

    // get list when we are connected, and display chat ui
    sock.on("welcome", function(list) {
        document.getElementById("radio2").checked = true;

        updateConnectedUsersList(list);
    });

    // update list when a new user is connected
    sock.on("list", function(list) {
        updateConnectedUsersList(list);
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
        commandsHistoryIndex = commandsHistory.length; // reset commands history index
        currEmojiIndex = -1; // reset emoji index
        emojiToComplete = null; // reset emoji to complete

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
                commandsHistory.push(textInput.value);

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


    /**********************************************
     * TextInput events
     *********************************************/
    var textInput = document.getElementById("myMessage");

    function autocompleteEmoji() {
            // symbol before cursor is ':'
            if (textInput.value.substring(0, textInput.selectionStart).match(/:\w*$/)) {
                if (currEmojiIndex == -1) {
                    emojiToComplete = textInput.value.substring(0, textInput.selectionStart).match(/:\w*$/)[0];
                }

                // if input starts with /chifoumi, we autocomplete only for chifoumi emojis
                if (textInput.value.match(/^\/chifoumi/)) {
                    var emoji = Object.keys(emojis).find(function(emoji) {
                        
                        return emoji.startsWith(emojiToComplete) && emoji.match(/:rock:|:paper:|:scissors:|:lizard:|:spock:/) && Object.keys(emojis).indexOf(emoji) > currEmojiIndex;
                    });
                }

                // else we autocomplete for all emojis
                else {
                    var emoji = Object.keys(emojis).find(function(emoji) {
                        return emoji.startsWith(emojiToComplete) && Object.keys(emojis).indexOf(emoji) > currEmojiIndex;
                    });
                }
                if (emoji) {
                    currEmojiIndex = Object.keys(emojis).indexOf(emoji);

                    if (textInput.value.match(/:\w+:$/)) {
                        textInput.value = textInput.value.replace(/:\w+:$/, emoji);
                    }
                    else {
                        textInput.value = textInput.value.replace(/:\w*$/, emoji);
                    }
                    textInput.selectionStart = textInput.selectionEnd = textInput.value.length;
                }

                // if no emoji found, we reset the index
                else {
                    currEmojiIndex = 0;
                }
            }
        }

    textInput.addEventListener("keydown", function(e) {
        // tab key
        if (e.key == "Tab") {
            e.preventDefault();
            autocompleteEmoji();
        }
        else {
            currEmojiIndex = -1;
            emojiToComplete = null;
        }



        // up arrow key
        if (e.key == "ArrowUp") {
            e.preventDefault();

            // we display the previous command
            if (commandsHistory.length > 0) {
                if (commandsHistoryIndex == 0) {
                    commandsHistoryIndex = commandsHistory.length;
                }
                commandsHistoryIndex--;
                textInput.value = commandsHistory[commandsHistoryIndex];

                textInput.selectionStart = textInput.selectionEnd = textInput.value.length;
            }
        }

        // down arrow key
        if (e.key == "ArrowDown") {
            e.preventDefault();

            // we display the next command
            if (commandsHistory.length > 0) {
                if (commandsHistoryIndex == commandsHistory.length - 1) {
                    commandsHistoryIndex = -1;
                }
                commandsHistoryIndex++;
                textInput.value = commandsHistory[commandsHistoryIndex];

                textInput.selectionStart = textInput.selectionEnd = textInput.value.length;
            }
        }


        // enter key
        if (e.key == "Enter") {
            e.preventDefault();

            document.getElementById("btnSend").click();
        }

        // space key
        if (e.key == " ") {
            // if we add a space after a complete emoji, we replace it by its image
            if (textInput.value.match(/:\w+:/)) {
                var textToReplace = textInput.value.match(/:\w+:/)[0];

                textInput.value = textInput.value.replace(/:\w+:/, replaceEmojisInMessage(textToReplace));
                textInput.selectionStart = textInput.selectionEnd = textInput.value.length;
            }
        }
    });


    var loginInput = document.getElementById("pseudo");

    loginInput.addEventListener("keydown", function(e) {
        // enter key
        if (e.key == "Enter") {
            e.preventDefault();

            document.getElementById("btnConnect").click();
        }
    });
});
    