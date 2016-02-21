"use strict";

angular.module("chatApp").controller("UserListController", ["$scope", "socket", "$location", "$routeParams",
function UserListController($scope, socket, $location, $routeParams) {
	console.log("virkar");
	socket.emit("users");
	$scope.users = {};
	$scope.usernames = [];
	$scope.errorMessage = "þetta sokkar";
	$scope.privateMessages = [];

	$scope.createRoom = function cRoom() {
		console.log("create room");
		
	}

	$scope.answerUser = function answrUser(user) {
		var path = "/private/" + user;
		$location.path(path);
	};

	var getUserList = function(userlist) {
		console.log("ég hata gretu salome");
		$scope.users = userlist;
		$scope.usernames = Object.keys(userlist);
	}
	var getPrvtMsg = function(username, message) {
		$scope.privateMessages.push({'nick': username, 'message': message});
	};

	socket.on("userlist", getUserList);

	socket.on('recv_privatemsg', getPrvtMsg);
}]);