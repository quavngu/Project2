"use strict";

angular.module("chatApp").controller("UserListController", ["$scope", "socket", "$location", "$routeParams",
function UserListController($scope, socket, $location, $routeParams) {
	console.log("virkar");
	socket.emit("users");
	$scope.users = {};
	$scope.usernames = [];
	$scope.errorMessage = "þetta sokkar";

	$scope.createRoom = function cRoom() {
		console.log("create room");
		
	}

	var getUserList = function(userlist) {
		console.log("ég hata gretu salome");
		$scope.users = userlist;
	}

	socket.on("userlist", getUserList);
}]);