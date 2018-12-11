function addNewUser() {
    let inputEmail = document.getElementById("inputEmail").value;
    let inputPws = document.getElementById("inputPws").value;
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    _addNewUser(inputEmail, inputPws, firstname, lastname);
}

function showDiv(classname) {
    $(classname).show();
}

function hideDiv(classname) {
    $(classname).hide();
}

function _addNewUser(email, password, firstname, lastname) {

    showDiv('.loading.style-2');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        console.log("status code here is ", this.status, this.readyState);
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            console.log(JSON.stringify(data, null, 10));
            hideDiv('.loading.style-2');

            //do anything with success response
        } else if(this.readyState == 4) {
            hideDiv('.loading.style-2');
            //show proper error response to user
        }
    };

    let payload = _constructNewUserPayload(email, password, firstname, lastname);
    let host = window.location.origin;
    if(host.startsWith("file")) {
        host = "http://localhost:1337";
    }
    xhttp.open("POST",host+'/add-user', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.send(JSON.stringify(payload));

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


function setArrayAndLength(id, array) {
    document.getElementById(id).innerHTML = array.join("\n");
    let element = document.getElementById(id).previousElementSibling;
    let value = element.innerHTML;
    value = value.split(":");
    value = value[0];
    element.innerHTML = `${value} : (${array.length})`;
}