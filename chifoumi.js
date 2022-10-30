const CHIFOUMI_CHOICES = [':rock:', ':paper:', ':scissors:', ':lizard:', ':spock:'];

var currentGames = {};

var scores = {};

function chifoumiRequestParametersValid(adversary, choice) {
  return adversary && choice && adversary[0] === '@' && CHIFOUMI_CHOICES.indexOf(choice) !== -1;
}

exports.playChifoumi = (me, opponent, choice, clients) => {
    if (!chifoumiRequestParametersValid(opponent, choice)) {
        console.log("[Chifoumi] Invalid request parameters");

        mySocket.emit("chifoumi-message", { opponent: opponent, text: "The command is invalid. Please use the following syntax: /chifoumi @opponent :choice:",
            date: Date.now() });
        return;
    }

    opponent = opponent.substring(1);

    var opponentSocket = clients[opponent];
    var mySocket = clients[me];
    if (!opponentSocket) {
        console.log("[Chifoumi] User " + opponent + " not found");

        mySocket.emit("chifoumi-message", { opponent: opponent, text: "User " + opponent + " unknown", date: Date.now() });
        return;
    }

    if (currentGames[me]) {
        console.log("[Chifoumi] " + me + " is already playing");

        mySocket.emit("chifoumi-message", { opponent: opponent, text: "You already have a game in progress. Please wait for it to finish before starting a new one.",
            date: Date.now() });
        return;
    }

    if (opponent === me) {
        console.log("[Chifoumi] User " + me + " is challenging himself (CHEATER!)");
        mySocket.emit("chifoumi-message", { opponent: opponent, text: "Are you trying to cheat? You can't play against yourself!", date: Date.now() });
        return;
    }

    if (currentGames[opponent]) {
        if (currentGames[opponent].opponent !== me) {
            console.log("[Chifoumi] " + opponent + " is already playing with someone else");

            mySocket.emit("chifoumi-message", { opponent: opponent, text: opponent + " already has a game in progress. Please wait for it to finish and try again later.",
                date: Date.now() });
            return;
        }

        // opponent is already playing with me, answer to the challenge
        sendChifoumiAnswer(me, opponent, choice, clients);
        return;
    }

    // send challenge to opponent
    sendChifoumiRequest(me, opponent, choice, clients);
};


function sendChifoumiRequest(me, opponent, choice, clients) {
    var opponentSocket = clients[opponent];
    var mySocket = clients[me];

    console.log("[Chifoumi] " + me + " challenges " + opponent + " with " + choice);

    currentGames[me] = { opponent: opponent, choice: choice };
    mySocket.emit("chifoumi-message", { sender: me, opponent: opponent, text: "Challenge sent to " + opponent, date: Date.now() });
    opponentSocket.emit("chifoumi-message", { sender: me, opponent: me, text: me + " challenges you to Rock-Paper-Scissors-Lizard-Spock", date: Date.now() });
}

function sendChifoumiAnswer(me, opponent, choice, clients) {
    var opponentSocket = clients[opponent];
    var mySocket = clients[me];

    console.log("[Chifoumi] " + opponent + " answers to " + me + " with " + choice);

    var results = checkChallengeResults(choice, currentGames[opponent].choice);
    var msgSender = results.text;
    var msgOpponent = results.text;

    if (results.senderWins) {
        msgSender += " - You win!";
        msgOpponent += " - You lose!";
    }
    else if (results.opponentWins) {
        msgSender += " - You lose!";
        msgOpponent += " - You win!";
    }

    // send right message to each player
    mySocket.emit("chifoumi-message", { opponent: opponent, text: msgSender, date: Date.now() });
    opponentSocket.emit("chifoumi-message", { opponent: me, text: msgOpponent, date: Date.now() });

    delete currentGames[opponent];

    // update scores
    if (results.senderWins) {
        if (!scores[me]) {
            scores[me] = 0;
        }
        scores[me]++;
    }
    else if (results.opponentWins) {
        if (!scores[opponent]) {
            scores[opponent] = 0;
        }
        scores[opponent]++;
    }

    // send scores to each player
    mySocket.emit("list", { clients: Object.keys(clients), scores: scores });
    mySocket.broadcast.emit("list", { clients: Object.keys(clients), scores: scores });
}

function checkChallengeResults(choiceSender, choiceOpponent) {
    var senderWins = false;
    var opponentWins = false;

    switch (choiceSender) {
        case ':rock:':
            senderWins = choiceOpponent === ':scissors:' || choiceOpponent === ':lizard:';
            opponentWins = choiceOpponent === ':paper:' || choiceOpponent === ':spock:';
            break;
        case ':paper:':
            senderWins = choiceOpponent === ':rock:' || choiceOpponent === ':spock:';
            opponentWins = choiceOpponent === ':scissors:' || choiceOpponent === ':lizard:';
            break;
        case ':scissors:':
            senderWins = choiceOpponent === ':paper:' || choiceOpponent === ':lizard:';
            opponentWins = choiceOpponent === ':rock:' || choiceOpponent === ':spock:';
            break;
        case ':lizard:':
            senderWins = choiceOpponent === ':paper:' || choiceOpponent === ':spock:';
            opponentWins = choiceOpponent === ':rock:' || choiceOpponent === ':scissors:';
            break;
        case ':spock:':
            senderWins = choiceOpponent === ':rock:' || choiceOpponent === ':scissors:';
            opponentWins = choiceOpponent === ':paper:' || choiceOpponent === ':lizard:';
            break;
    }

    
    var msg;

    if (choiceSender === ':scissors:' && choiceOpponent === ':paper:' || choiceSender === ':paper:' && choiceOpponent === ':scissors:') {
        msg = ":scissors: cuts :paper:";
    }
    else if (choiceSender === ':paper:' && choiceOpponent === ':rock:' || choiceSender === ':rock:' && choiceOpponent === ':paper:') {
        msg = ":paper: covers :rock:";
    }
    else if (choiceSender === ':rock:' && choiceOpponent === ':lizard:' || choiceSender === ':lizard:' && choiceOpponent === ':rock:') {
        msg = ":rock: crushes :lizard:";
    }
    else if (choiceSender === ':lizard:' && choiceOpponent === ':spock:' || choiceSender === ':spock:' && choiceOpponent === ':lizard:') {
        msg = ":lizard: poisons :spock:";
    }
    else if (choiceSender === ':spock:' && choiceOpponent === ':scissors:' || choiceSender === ':scissors:' && choiceOpponent === ':spock:') {
        msg = ":spock: smashes :scissors:";
    }
    else if (choiceSender === ':scissors:' && choiceOpponent === ':lizard:' || choiceSender === ':lizard:' && choiceOpponent === ':scissors:') {
        msg = ":scissors: decapitates :lizard:";
    }
    else if (choiceSender === ':lizard:' && choiceOpponent === ':paper:' || choiceSender === ':paper:' && choiceOpponent === ':lizard:') {
        msg = ":lizard: eats :paper:";
    }
    else if (choiceSender === ':paper:' && choiceOpponent === ':spock:' || choiceSender === ':spock:' && choiceOpponent === ':paper:') {
        msg = ":paper: disproves :spock:";
    }
    else if (choiceSender === ':spock:' && choiceOpponent === ':rock:' || choiceSender === ':rock:' && choiceOpponent === ':spock:') {
        msg = ":spock: vaporizes :rock:";
    }
    else if (choiceSender === ':rock:' && choiceOpponent === ':scissors:' || choiceSender === ':scissors:' && choiceOpponent === ':rock:') {
        msg = ":rock: crushes :scissors:";
    }
    else {
        msg = "It's a tie!";
    }

    return { senderWins: senderWins, opponentWins: opponentWins, text: msg };
}


exports.getScores = function () {
    return scores;
}