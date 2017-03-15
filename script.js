
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
	this.firstName = firstName;
	this.lastName = lastName;
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
	var tempFirstName = "";
	var tempLastName = "";
	var tempEmail = "";
	result.forEach(function(user) {
		tempFirstName = user.name.first.capitalizeFirstLetter();
		tempLastName = user.name.last.capitalizeFirstLetter();
		tempEmail = user.email;
		APP.DATA.addUserToArray(
		new APP.DATA.User(
			tempFirstName, 
			tempLastName, 
			tempEmail
			),
		APP.UTILS.generateUserRow(tempFirstName, tempLastName, tempEmail),
		"visible");	
	});
}

APP.UTILS.initView = function() {
	var table = document.getElementById("usersTable");
	table.appendChild(document.createElement("tbody"));
	var tableBody = table.children[1];
	APP.DATA.usersArray.forEach(function(user) {
		tableBody.appendChild(user.row);
	});
}

APP.UTILS.generateUserRow = function(firstName, lastName, email) {
	var firstNameCell = document.createElement("td");
	var lastNameCell = document.createElement("td");
	var emailCell = document.createElement("td");
	
	firstNameCell.textContent = firstName;
	lastNameCell.textContent = lastName;
	emailCell.textContent = email;
	
	var userRow = document.createElement("tr");
	userRow.appendChild(firstNameCell);
	userRow.appendChild(lastNameCell);
	userRow.appendChild(emailCell);
	
	return userRow;
}

APP.UTILS.filterBoxListener = function() {
	console.log("keyupp");
	if((!APP.UTILS.currentSearchTimeout) 
		|| APP.UTILS.currentSearchTimeout.finished
		|| APP.UTILS.currentSearchTimeout.cleared){
		APP.UTILS.currentSearchTimeout = new APP.UTILS.SearchTimeout(function() {
			console.log("searching");
			APP.UTILS.currentSearchTimeout.finished = true;
		}, 2000);
	}
	else {
		APP.UTILS.currentSearchTimeout.clear();
	}
		
	}
	
APP.UTILS.SearchTimeout = function(fn, interval) {
	var id = setTimeout(fn, interval);
	this.cleared = false;
	this.finished = false;
	this.clear = function () {
		this.cleared = true;
		clearTimeout(id);
	};
}

APP.UTILS.currentSearchTimeout;
	

String.prototype.capitalizeFirstLetter = function() {
	return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

window.onload = function() {
	APP.NETWORKUTILS.loadUsers(APP.UTILS.initView);
	document.getElementById("userFilter").addEventListener("keyup", APP.UTILS.filterBoxListener);
	};
