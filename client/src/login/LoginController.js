"use strict";

angular.module("chatApp").controller("LoginController", ["$scope", "$location", "$http", "ChatResource", "socket",
function LoginController($scope, $location, $http, ChatResource, socket) {
	$scope.user = "";
	$scope.errorMessage = "";

	$scope.onLogin = function onLogin() {
		socket.emit("adduser", $scope.user, function(available){
    		if (available){
       			console.log($scope.user + " is available");
       			$location.path("/roomlist");
    		} else {
    			$scope.errorMessage = "Please try another username";
    		}
		});
	};
}]);