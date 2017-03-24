
var APP = APP || {};
APP.NETWORKUTILS = APP.NETWORKUTILS || {};
APP.DATA = APP.DATA || {};
APP.UTILS = APP.UTILS || {};

APP.NETWORKUTILS.loadUsers = function(initializeViewCallback) {
	var request = new XMLHttpRequest();
	request.addEventListener("load", function() {
		var jsonResponse = JSON.parse(request.responseText);
		APP.UTILS.generateUsersArray(jsonResponse["results"]);
		initializeViewCallback();
	});
	request.open("GET", "https://randomuser.me/api/?results=100");
	request.send();
}

APP.DATA.User = function(firstName, lastName, email) {
	this.firstName = firstName[0].toUpperCase() + firstName.slice(1, firstName.length);
	this.lastName = lastName[0].toUpperCase() + lastName.slice(1, lastName.length);;
	this.email = email;
}

APP.DATA.usersArray = [];

APP.DATA.addUserToArray = function(user, row, state) {
	APP.DATA.usersArray.push({
		user: user,
		row: row,
		state: state
	});
}

APP.UTILS.generateUsersArray = function(result) {
	var tempUser;
	result.forEach(function(user, i) {
		tempUser = new APP.DATA.User(user.name.first, user.name.last, user.email)
		function onClick(firstName, lastName, email) {
			APP.DATA.usersArray[i].user.firstName = firstName;
			}
		APP.DATA.addUserToArray(
		tempUser,
		APP.UTILS.generateUserRow(tempUser, onClick),
		"visible");
		
	});
}

APP.UTILS.initView = function() {
	APP.UTILS.usersTable = document.getElementById("usersTable");
	var tableBody = APP.UTILS.usersTable.children[1];
	tableBody = APP.UTILS.usersTable.appendChild(document.createElement("tbody"));
	APP.DATA.usersArray.forEach(function(user) {
		if(user.state === "visible") {
			tableBody.appendChild(user.row);
		}
		
	});
}

APP.UTILS.generateUserRow = function(user, editButtonOnClickHandler) {
	var firstNameCell = document.createElement("td");
	var firstNameInput = document.createElement("input");
	firstNameInput.setAttribute("type", "text");
	firstNameInput.disabled = true;
	var lastNameCell = document.createElement("td");
	var lastNameInput = document.createElement("input");
	lastNameInput.setAttribute("type", "text");
	lastNameInput.disabled = true;
	var emailCell = document.createElement("td");
	var emailInput = document.createElement("input");
	emailInput.setAttribute("type", "text");
	emailInput.disabled = true;
	var editButtonCell = document.createElement("td");
	var editButton = document.createElement("button");
	
	editButton.innerHTML = "Edit";
	editButtonCell.appendChild(editButton);
	editButton.addEventListener("click", function() {
		if(this.innerHTML === "Edit") {
			this.innerHTML = "Save";
			firstNameInput.disabled = false;
			lastNameInput.disabled = false;
			emailInput.disabled = false;
			
		} else {
			this.innerHTML = "Edit";
			firstNameInput.disabled = true;
			lastNameInput.disabled = true;
			emailInput.disabled = true;
			editButtonOnClickHandler(firstNameInput.value, lastNameInput.value, emailInput.value);
		}
		
	}
	);
	firstNameCell.appendChild(firstNameInput);
	firstNameInput.value = user.firstName;
	lastNameCell.appendChild(lastNameInput);
	lastNameInput.value = user.lastName;
	emailCell.appendChild(emailInput);
	emailInput.value = user.email;
	
	var userRow = document.createElement("tr");
	userRow.appendChild(firstNameCell);
	userRow.appendChild(lastNameCell);
	userRow.appendChild(emailCell);
	userRow.appendChild(editButtonCell);
	userRow.style.display = "table-row";
	
	return userRow;
}

APP.UTILS.filterBoxListener = function() {
	console.log("keyupp");
	if(!APP.UTILS.currentSearchTimeout.finished 
	|| !APP.UTILS.currentSearchTimeout.cleared){
		APP.UTILS.currentSearchTimeout.clear();
	}
	APP.UTILS.currentSearchTimeout.resetTimer();
	}
	
	
APP.UTILS.getSearchString = function() {
	return document.getElementById("userFilter").value;
}
	
APP.UTILS.SearchTimeout = function(interval) {
	var timer;
	
	var fn = function() {
		var searchString = APP.UTILS.getSearchString();
		console.log("searchString " + searchString);
		APP.DATA.usersArray.forEach(function(user) {
			if(user.user.firstName.indexOf(searchString) >= 0 
				|| user.user.lastName.indexOf(searchString) >= 0
				|| user.user.email.indexOf(searchString) >= 0) {
					user.state = "visible";
					if(user.row.style.display !== "table-row") {
						user.row.style.display = "table-row"
					}
				}
				else {
					user.state = "invisible";
					if(user.row.style.display !== "none") {
						user.row.style.display = "none"
					}
				}
		})
		APP.UTILS.currentSearchTimeout.finished = true;
	}
	this.cleared = true;
	this.finished = true;
	this.clear = function () {
		this.cleared = true;
		clearTimeout(this.timer);
	};
	this.resetTimer = function() {
		this.timer = setTimeout(fn, interval);
		this.cleared = false;
		this.finished = false;
	}
	
}

window.onload = function() {
	APP.NETWORKUTILS.loadUsers(APP.UTILS.initView);
	APP.UTILS.currentSearchTimeout = new APP.UTILS.SearchTimeout(2000);
	document.getElementById("userFilter").addEventListener("keyup", APP.UTILS.filterBoxListener);
	};
