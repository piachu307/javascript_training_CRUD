
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
APP.DATA.filteredUsersArray = [];

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
	var tableBody = table.children[1];
	if(tableBody && tableBody.tagName == "TBODY") {
		table.removeChild(tableBody);
	}
	tableBody = table.appendChild(document.createElement("tbody"));
	//var tableBody = table.children[1];
	APP.DATA.usersArray.forEach(function(user) {
		if(user.state === "visible") {
			tableBody.appendChild(user.row);
		}
		
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
	if(APP.UTILS.currentSearchTimeout.finished 
	|| APP.UTILS.currentSearchTimeout.cleared){
		APP.UTILS.currentSearchTimeout.resetTimer();
	}
	else {
		APP.UTILS.currentSearchTimeout.clear();
		APP.UTILS.currentSearchTimeout.resetTimer();
	}
		
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
			if(user.user.firstName.indexOf(searchString) >= 0 || 
			user.user.lastName.indexOf(searchString) >= 0
			|| user.user.email.indexOf(searchString) >= 0) 
			{
				user.state = "visible";
			}
			else {
				user.state = "invisible";
			}
		})
		APP.UTILS.initView();
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

	

String.prototype.capitalizeFirstLetter = function() {
	return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

window.onload = function() {
	APP.NETWORKUTILS.loadUsers(APP.UTILS.initView);
	APP.UTILS.currentSearchTimeout = new APP.UTILS.SearchTimeout(2000);
	document.getElementById("userFilter").addEventListener("keyup", APP.UTILS.filterBoxListener);
	};
