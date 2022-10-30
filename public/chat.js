"use strict";

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
        var pseudo = document.getElementById("pseudo").value;
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
     * Displays messages
     *********************************************/

    sock.on("message", function(msg) {
        var p = document.createElement("p");

        if (msg.from == null) { // system message
            p.classList.add("system");

            p.textContent = timestampToTime(msg.date) + " - [admin] : " + msg.text;
        }

        document.getElementsByTagName("main")[0].appendChild(p);
    });
});
    