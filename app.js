var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/messages/deployments', function (message) {
            console.log("I got a deployment!");
            showDeploymentMessage(JSON.parse(message.body).content);
        });
        stompClient.subscribe('/topic/messages/applications', function (message) {
            console.log("I got an application!");
            showApplicationMessage(JSON.parse(message.body).content);
        });
        stompClient.subscribe('/topic/messages/signoffs', function (message) {
            console.log("I got a signoff!");
            showSignoffMessage(JSON.parse(message.body).content);
        });
        stompClient.subscribe('/topic/messages/boxsets', function (message) {
            console.log("I got a boxset!");
            showBoxsetMessage(JSON.parse(message.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function showDeploymentMessage(deployment) {
    if (deployment.toString().includes("Success")) {
        var row = $("<tr bgcolor='#90ee90'><td>" + deployment + "</td></tr>");
    } else if (deployment.toString().includes("Failed")) {
        var row = $("<tr bgcolor='#f08080'><td>" + deployment + "</td></tr>");
    } else {
        var row = $("<tr bgcolor='#eee8aa'><td>" + deployment + "</td></tr>");
    }
    row.hide();
    $("#deployments").prepend(row);
    row.fadeIn("slow");
}

function showDeployments() {
    $("#applications").hide();
    $("#signoffs").hide();
    $("#boxsets").hide();
    $("#deployments").fadeIn();
}

function showApplicationMessage(application) {
    var row = $("<tr><td>" + application + "</td></tr>");
    row.hide();
    $("#applications").prepend(row);
    row.fadeIn("slow");
}

function showApplications() {
    $("#deployments").hide();
    $("#signoffs").hide();
    $("#boxsets").hide();
    $("#applications").fadeIn();
}

function showSignoffMessage(signoff) {
    var row = $("<tr><td>" + signoff + "</td></tr>");
    row.hide();
    $("#signoffs").prepend(row);
    row.fadeIn("slow");
}

function showSignoffs() {
    $("#applications").hide();
    $("#deployments").hide();
    $("#boxsets").hide();
    $("#signoffs").fadeIn();
}

function showBoxsetMessage(boxset) {
    var row = $("<tr><td>" + boxset + "</td></tr>");
    row.hide();
    $("#boxsets").prepend(row);
    row.fadeIn("slow");
}

function showBoxsets() {
    $("#signoffs").hide();
    $("#applications").hide();
    $("#deployments").hide();
    $("#boxsets").fadeIn();
}

function deleteHistory() {
    $("#deployments").html("<thead><tr><th>Deployments</th></tr></thead>");
    $("#applications").html("<thead><tr><th>Endpoints</th></tr></thead>");
    $("#signoffs").html("<thead><tr><th>Signoffs</th></tr></thead>");
    $("#boxsets").html("<thead><tr><th>Boxsets</th></tr></thead>");
}

$(function () {
    showDeployments();
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#delete-history").click(function () { deleteHistory(); });
});