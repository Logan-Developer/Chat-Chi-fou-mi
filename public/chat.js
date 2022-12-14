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
    ":grinning:": "๐",
    ":smiley:": "๐",
    ":smile:": "๐",
    ":grin:": "๐",
    ":laughing:": "๐",
    ":satisfied:": "๐",
    ":sweat_smile:": "๐",
    ":rofl:": "๐คฃ",
    ":joy:": "๐",
    ":slightly_smiling_face:": "๐",
    ":upside_down_face:": "๐",
    ":wink:": "๐",
    ":blush:": "๐",
    ":innocent:": "๐",
    ":smiling_face_with_three_hearts:": "๐ฅฐ",
    ":heart_eyes:": "๐",
    ":star_struck:": "๐คฉ",
    ":kissing_heart:": "๐",
    ":kissing:": "๐",
    ":kissing_closed_eyes:": "๐",
    ":kissing_smiling_eyes:": "๐",
    ":smiling_face_with_tear:": "๐ฅฒ",
    ":yum:": "๐",
    ":stuck_out_tongue:": "๐",
    ":stuck_out_tongue_winking_eye:": "๐",
    ":zany_face:": "๐คช",
    ":stuck_out_tongue_closed_eyes:": "๐",
    ":money_mouth_face:": "๐ค",
    ":hugs:": "๐ค",
    ":hand_over_mouth:": "๐คญ",
    ":shushing_face:": "๐คซ",
    ":thinking:": "๐ค",
    ":zipper_mouth_face:": "๐ค",
    ":raised_eyebrow:": "๐คจ",
    ":neutral_face:": "๐",
    ":expressionless:": "๐",
    ":no_mouth:": "๐ถ",
    ":smirk:": "๐",
    ":unamused:": "๐",
    ":roll_eyes:": "๐",
    ":grimacing:": "๐ฌ",
    ":face_exhaling:": "๐ฎโ๐จ",
    ":lying_face:": "๐คฅ",
    ":relieved:": "๐",
    ":pensive:": "๐",
    ":sleepy:": "๐ช",
    ":drooling_face:": "๐คค",
    ":sleeping:": "๐ด",
    ":mask:": "๐ท",
    ":face_with_thermometer:": "๐ค",
    ":face_with_head_bandage:": "๐ค",
    ":nauseated_face:": "๐คข",
    ":vomiting_face:": "๐คฎ",
    ":sneezing_face:": "๐คง",
    ":hot_face:": "๐ฅต",
    ":cold_face:": "๐ฅถ",
    ":woozy_face:": "๐ฅด",
    ":dizzy_face:": "๐ต",
    ":exploding_head:": "๐คฏ",
    ":cowboy_hat_face:": "๐ค?",
    ":partying_face:": "๐ฅณ",
    ":disguised_face:": "๐ฅธ",
    ":sunglasses:": "๐",
    ":nerd_face:": "๐ค",
    ":monocle_face:": "๐ง",
    ":confused:": "๐",
    ":worried:": "๐",
    ":slightly_frowning_face:": "๐",
    ":frowning_face:": "โน๏ธ",
    ":open_mouth:": "๐ฎ",
    ":hushed:": "๐ฏ",
    ":astonished:": "๐ฒ",
    ":flushed:": "๐ณ",
    ":pleading_face:": "๐ฅบ",
    ":frowning:": "๐ฆ",
    ":anguished:": "๐ง",
    ":fearful:": "๐จ",
    ":cold_sweat:": "๐ฐ",
    ":disappointed_relieved:": "๐ฅ",
    ":cry:": "๐ข",
    ":sob:": "๐ญ",
    ":scream:": "๐ฑ",
    ":confounded:": "๐",
    ":persevere:": "๐ฃ",
    ":disappointed:": "๐",
    ":sweat:": "๐",
    ":weary:": "๐ฉ",
    ":tired_face:": "๐ซ",
    ":yawning_face:": "๐ฅฑ",
    ":triumph:": "๐ค",
    ":pout:": "๐ก",
    ":rage:": "๐?",
    ":angry:": "๐?",
    ":cursing_face:": "๐คฌ",
    ":smiling_imp:": "๐",
    ":imp:": "๐ฟ",
    ":skull:": "๐",
    ":skull_and_crossbones:": "โ?๏ธ",
    ":hankey:": "๐ฉ",
    ":poop:": "๐ฉ",
    ":shit:": "๐ฉ",
    ":clown_face:": "๐คก",
    ":japanese_ogre:": "๐น",
    ":japanese_goblin:": "๐บ",
    ":ghost:": "๐ป",
    ":alien:": "๐ฝ",
    ":space_invader:": "๐พ",
    ":robot:": "๐ค",
    ":smiley_cat:": "๐บ",
    ":smile_cat:": "๐ธ",
    ":joy_cat:": "๐น",
    ":heart_eyes_cat:": "๐ป",
    ":smirk_cat:": "๐ผ",
    ":kissing_cat:": "๐ฝ",
    ":scream_cat:": "๐",
    ":crying_cat_face:": "๐ฟ",
    ":pouting_cat:": "๐พ",
    ":see_no_evil:": "๐",
    ":hear_no_evil:": "๐",
    ":speak_no_evil:": "๐",
    ":kiss:": "๐",
    ":love_letter:": "๐",
    ":cupid:": "๐",
    ":gift_heart:": "๐",
    ":sparkling_heart:": "๐",
    ":heartpulse:": "๐",
    ":heartbeat:": "๐",
    ":revolving_hearts:": "๐",
    ":two_hearts:": "๐",
    ":heart_decoration:": "๐",
    ":heavy_heart_exclamation:": "โฃ๏ธ",
    ":broken_heart:": "๐",
    ":heart:": "โค๏ธ",
    ":orange_heart:": "๐งก",
    ":yellow_heart:": "๐",
    ":green_heart:": "๐",
    ":blue_heart:": "๐",
    ":purple_heart:": "๐",
    ":brown_heart:": "๐ค",
    ":black_heart:": "๐ค",
    ":white_heart:": "๐ค",
    ":100:": "๐ฏ",
    ":anger:": "๐ข",
    ":boom:": "๐ฅ",
    ":collision:": "๐ฅ",
    ":dizzy:": "๐ซ",
    ":sweat_drops:": "๐ฆ",
    ":dash:": "๐จ",
    ":hole:": "๐ณ๏ธ",
    ":bomb:": "๐ฃ",
    ":speech_balloon:": "๐ฌ",
    ":eye_speech_bubble:": "๐๏ธโ๐จ๏ธ",
    ":left_speech_bubble:": "๐จ๏ธ",
    ":right_anger_bubble:": "๐ฏ๏ธ",
    ":thought_balloon:": "๐ญ",
    ":zzz:": "๐ค",
    ":wave:": "๐",
    ":raised_back_of_hand:": "๐ค",
    ":raised_hand_with_fingers_splayed:": "๐๏ธ",
    ":hand:": "โ",
    ":raised_hand:": "โ",
    ":vulcan_salute:": "๐",
    ":ok_hand:": "๐",
    ":pinched_fingers:": "๐ค",
    ":pinching_hand:": "๐ค",
    ":v:": "โ๏ธ",
    ":crossed_fingers:": "๐ค",
    ":love_you_gesture:": "๐ค",
    ":metal:": "๐ค",
    ":call_me_hand:": "๐ค",
    ":point_left:": "๐",
    ":point_right:": "๐",
    ":point_up_2:": "๐",
    ":fu:": "๐",
    ":middle_finger:": "๐",
    ":point_down:": "๐",
    ":point_up:": "โ๏ธ",
    ":thumbsup:": "๐",
    ":thumbsdown:": "๐",
    ":fist:": "โ",
    ":fist_raised:": "โ",
    ":facepunch:": "๐",
    ":fist_oncoming:": "๐",
    ":punch:": "๐",
    ":fist_left:": "๐ค",
    ":fist_right:": "๐ค",
    ":clap:": "๐",
    ":raised_hands:": "๐",
    ":open_hands:": "๐",
    ":palms_up_together:": "๐คฒ",
    ":handshake:": "๐ค",
    ":pray:": "๐",
    ":writing_hand:": "โ๏ธ",
    ":nail_care:": "๐",
    ":selfie:": "๐คณ",
    ":muscle:": "๐ช",
}

// add emojis required for chifoumi (:rock:, :paper:, :scissors:, :lizard:, :spock:)
emojis[CHIFOUMI_CHOICES[0]] = "โ";
emojis[CHIFOUMI_CHOICES[1]] = "๐";
emojis[CHIFOUMI_CHOICES[2]] = "โ";
emojis[CHIFOUMI_CHOICES[3]] = "๐ฆ";
emojis[CHIFOUMI_CHOICES[4]] = "๐";

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
        if (list.scores[a] === undefined) {
            list.scores[a] = 0;
        }
        if (list.scores[b] === undefined) {
            list.scores[b] = 0;
        }

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
                p.textContent += " [private";

                if (msg.from === pseudo) {
                    p.textContent += " @" + msg.to;
                }
                p.textContent += "]";

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
    