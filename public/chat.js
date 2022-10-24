"use strict";

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

    sock.on("error-connection", function(msg) {
        alert(msg);
    });

    sock.on("welcome", function(clients) {
        document.getElementById("radio2").checked = true;
    });
});
    