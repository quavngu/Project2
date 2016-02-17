"use strict";

angular.module("chatApp").controller("LoginController", ["$scope", "$http", "socket",
function LoginController($scope, $http, socket) {
	$scope.errorMessage = "test";
/*
	$scope.user = "";
	$scope.errorMessage = "";

	$scope.onLogin = function onLogin() {
		ChatResource.login($scope.user, function(success) {
		if(!success) {
			$scope.errorMessage = "Login failed";
		}
		else {
			// TODO: Redirect the user to the room list.
		}
	});
	};*/
}]);