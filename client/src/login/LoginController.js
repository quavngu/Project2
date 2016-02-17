"use strict";

angular.module("chatApp").controller("LoginController", ["$scope", "$http", "ChatResource", "socket",
function LoginController($scope, $http, ChatResource, socket) {
	$scope.user = "";
	$scope.errorMessage = "";

	$scope.onLogin = function onLogin() {
		ChatResource.login($scope.user, function(success) {
		if(!success) {
			$scope.errorMessage = "Login failed";
		}
		else {
			$location("#/roomlist");
		}
	});
	};
}]);