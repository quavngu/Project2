"use strict";

angular.module("chatApp").controller("UserListController", ["$scope", "socket", "$location", "$routeParams",
function UserListController($scope, socket, $location, $routeParams) {
	console.log("virkar");
	socket.emit("users");
	$scope.users = {};
	$scope.usernames = [];
	$scope.errorMessage = "";

	$scope.createRoom = function cRoom() {
		console.log("create room");
		
	};

	$scope.answerUser = function answrUser(user) {
		var path = "/private/" + user;
		$location.path(path);
	};

	var getUserList = function(userlist) {
		console.log("ég hata gretu salome");
		$scope.users = userlist;
		$scope.usernames = Object.keys(userlist);
	};

	socket.on("userlist", getUserList);
}]);