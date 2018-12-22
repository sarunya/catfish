var identityIdStr = "identity_id";
var loginId = "#loginBtn";
var registerId = "#registerBtn";
var logoutId = '#logoutBtn';
var loadingCss = '.loading.style-2';
var registerModalId = '#myModal2';
var loginModalId = "#myModal";

function addNewUser() {
    let inputEmail = document.getElementById("inputEmail").value;
    let inputPws = document.getElementById("inputPws").value;
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    _addNewUser(inputEmail, inputPws, firstname, lastname);
}

function loginUser() {
    let inputEmail = document.getElementById("email").value;
    let inputPws = document.getElementById("pws").value;
    _loginUser(inputEmail, inputPws);
}

function logoutUser() {

    //Set IdentityId 
    eraseCookie(identityIdStr);

    //Remove login and register icons
    hideModal(registerModalId);
    hideModal(loginModalId);
    showDiv(loginId);
    showDiv(registerId);
    hideDiv(logoutId);
}


function showDiv(classname) {
    $(classname).show();
}

function hideDiv(classname) {
    $(classname).hide();
}

function hideModal(classname) {
    $(classname).modal('hide');
}

function _addNewUser(email, password, firstname, lastname) {

    showDiv(loadingCss);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        console.log("status code here is ", this.status, this.readyState);
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            hideDiv(loadingCss);
            hideModal(registerModalId);
            loggedInUser(data);
            //do anything with success response
        } else if(this.readyState == 4) {
            hideDiv(loadingCss);
            //show proper error response to user
        }
    };

    let payload = _constructNewUserPayload(email, password, firstname, lastname);
    let host = window.location.origin;
    if(host.startsWith("file")) {
        host = "http://localhost:1337";
    }
    xhttp.open("PUT",host+'/register-user', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.send(JSON.stringify(payload));

}

function _loginUser(email, password) {

    showDiv(loadingCss);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        console.log("status code here is ", this.status, this.readyState);
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            hideDiv(loadingCss);
            hideModal(loginModalId);
            loggedInUser(data);
            //do anything with success response
        } else if(this.readyState == 4) {
            hideDiv(loadingCss);
            //show proper error response to user
        }
    };

    let payload = {
        email : email,
        password : password
    };
    let host = window.location.origin;
    if(host.startsWith("file")) {
        host = "http://localhost:1337";
    }
    xhttp.open("GET",host+`/login-user?email=${email}&password=${password}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.send();
}

function _constructNewUserPayload(inputEmail, inputPws, firstname, lastname) {
    let data = {
        "email": inputEmail,
        "first_name": firstname,
        "last_name": lastname,
        "password": {
            "active_password": inputPws
            // "old_password1": "password2",
            // "old_password2": "password3",
            // "old_password3": "password4"
        }
    }
    return data;
}

function loggedInUser(data) {
    //Set IdentityId 
    setCookie(identityIdStr, data.identity_id, 1);

    //Remove login and register icons
    hideDiv(loginId);
    hideDiv(registerId);
    showDiv(logoutId);
    console.log("loggedin user");
}

function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	document.cookie = name + '=; Max-Age=-99999999;';
}