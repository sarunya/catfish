var identityId = null;
var saveDocumentId = "#saveDocument";
var docNameId = "docName";
var guestPwdId = "guestpws";
var loadingCss = '#loading';
var saveDocModalId = "#saveDocModal";
var savedDocSelectId = "savedDocuments";
var savedDocSelBtnId = "#savedDocumentsBtn";
var loadDocId = "#loadDocument";



function init(newDocument) {
	//// Initialize Firebase.
	//// TODO: replace with your Firebase project configuration.
	var config = {
		apiKey: "AIzaSyC_JdByNm-E1CAJUkePsr-YJZl7W77oL3g",
		authDomain: "firepad-tests.firebaseapp.com",
		databaseURL: "https://firepad-tests.firebaseio.com"
	};
	firebase.initializeApp(config);
	//// Get Firebase Database reference.
	loadFirebase(newDocument);

	identityId = getCookie('identity_id');
	console.log("identityid", identityId);
	if(identityId) {
		showDiv(saveDocumentId);
		loadSavedDocuments(identityId);
	} else {
		hideDiv(saveDocumentId);
		hideDiv(savedDocSelBtnId);
		hideDiv(loadDocId);
	}
}

function loadFirebase(newDocument) {
	var firepadRef = getExampleRef(newDocument);
}

function loadSavedDocuments(identityId) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let data = JSON.parse(this.responseText);
			console.log(JSON.stringify(data, null, 10));
			var docSelectElement = document.getElementById(savedDocSelectId);

			for(var doc of data) {
				var option = document.createElement("option");
				option.text = doc.doc_name;
				option.setAttribute("doc_id", doc.firebase_id);
				docSelectElement.add(option);
			}

			if(data.length > 0) {
				showDiv(savedDocSelBtnId);
				showDiv(loadDocId);
			} else {
				hideDiv(savedDocSelBtnId);
				hideDiv(loadDocId);
			}
			
		} else if(this.readyState === 4) {
			console.log("error");
		}
	};

	let host = getCurrentHost();
	xhttp.open("GET", host + '/saved-codeshare', true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.setRequestHeader("identity_id", identityId);
	xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhttp.send();
}

function getCurrentHost() {
	let host = window.location.origin;
	console.log(window.location);
	if (host.startsWith("file")) {
		host = "http://localhost:1337";
	}
	return host;
}

function loadDocument() {
	var e = document.getElementById(savedDocSelectId); 
	var option = e.options[e.selectedIndex];
	var firebaseId = option.getAttribute("doc_id");
	var host = getCurrentHost();
	window.open(host+"/codeshare.html"+firebaseId);
}

// Helper to get hash from end of URL or generate a random one.
function getExampleRef(newDocument = false) {
	var ref = firebase.database().ref();
	var visitorId = getVisitorId();

	var xhttp1 = new XMLHttpRequest();
	xhttp1.onreadystatechange = function () {
		var hash = window.location.hash.replace(/#/g, '');
		if (this.readyState == 4 && this.status == 200) {
			hash = (hash.trim().length > 0) ? hash : this.responseText;

			if (!newDocument && hash.length > 0) {
				ref = ref.child(hash);
				window.location = window.location.origin + window.location.pathname + '#' + ref.key; // add it as a hash to the URL.
				hash = ref.key;
			} else {
				ref = ref.push(); // generate unique location.
				window.location = window.location.origin + window.location.pathname + '#' + ref.key; // add it as a hash to the URL.
				hash = ref.key;
			}
			if (typeof console !== 'undefined') {
				console.log('Firebase data: ', ref.toString());
			}
			let url = window.location.origin + '/get-tiny-url?url=' + encodeURIComponent(window.location.href);
			$("#link").attr("href", url);
			updateCodeShareForVisitor(visitorId, hash);


			var firepadRef = ref;
			//// Create CodeMirror (with line numbers and the JavaScript mode).
			var codeMirror = CodeMirror(document.getElementById('firepad-container'), {
				lineNumbers: true,
				mode: 'javascript'
			});
			//// Create Firepad.
			var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
				defaultText: 'Put your code here'
			});
			if(newDocument) {
				document.location.reload() ;
			}
			return ref;
		};

	}
	let host = getCurrentHost();
	xhttp1.open("POST", host + '/get-code-map', true);
	xhttp1.setRequestHeader("Content-type", "application/json");
	xhttp1.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhttp1.send(JSON.stringify({
		visitor_id: visitorId
	}));
}

function getVisitorId() {
	var req = new XMLHttpRequest();
	req.open('GET', window.location.href, false);
	req.send(null);
	var headers = req.getAllResponseHeaders().toLowerCase();
	return req.getResponseHeader("visitor_id");
}

function updateCodeShareForVisitor(visitorId, hash) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
		}
	};

	let host = getCurrentHost();
	xhttp.open("POST", host + '/visitor-map', true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhttp.send(JSON.stringify({
		visitor_id: visitorId,
		hash: hash
	}));
}

function saveDocument() {
	var firebaseId = window.location.hash;
    let docName = document.getElementById(docNameId).value;
    let guestPass = document.getElementById(guestPwdId).value;
	console.log(identityId, firebaseId, docName, guestPass);
	_saveDocument(identityId, firebaseId, docName, guestPass);
}

function _saveDocument(identityId, firebaseId, docName, guestPass) {

    showDiv(loadingCss);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        console.log("status code here is ", this.status, this.readyState);
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            hideDiv(loadingCss);
			hideModal(saveDocModalId);
			console.log("save success");
            //do anything with success response
        } else if(this.readyState == 4) {
            hideDiv(loadingCss);
			//show proper error response to user
			console.log(JSON.stringify(this.responseText, null, 10));
        }
    };

    let payload = _constructNewUserPayload(identityId, firebaseId, docName, guestPass);
    let host = getCurrentHost();
    xhttp.open("PUT",host+'/save-codeshare', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhttp.send(JSON.stringify(payload));

}

function _constructNewUserPayload(identityId, firebaseId, docName, guestPass) {
	return {
        "identity_id": identityId,
        "firebase_id": firebaseId,
        "guest_password": guestPass,
        "doc_name": docName
    }
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

function showDiv(classname) {
    $(classname).show();
}

function hideDiv(classname) {
    $(classname).hide();
}

function hideModal(classname) {
    $(classname).modal('hide');
}