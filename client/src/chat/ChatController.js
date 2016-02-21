"use strict";

angular.module("chatApp").controller("ChatController", ["$scope", "socket", "$location", "$routeParams",
function ChatController($scope, socket, $location, $routeParams) {
	$scope.otherUser = $routeParams.user;
	$scope.messages = [];
	$scope.username = "";
	$scope.errorMessage = "";
	

	var updateChat = function(username, message) {
		if (username === $scope.otherUser) {
			$scope.messages.push({'nick': username, 'message': message});
		}
	};

	$scope.partRoom = function partRoom() {
		$location.path("/userlist");
	};

	$scope.sendMessage = function sendMessage() {
		var msgObj = {'nick': $scope.otherUser, 'message': $scope.message}
		socket.emit('privatemsg', msgObj, function(accepted) {
			if (!accepted) {
				$scope.errorMessage = "Could not send message";
			}
			else {
				var meString = "Me";
				$scope.messages.push({'nick': meString, 'message': msgObj.message});
				$scope.errorMessage = "";	
			}
		}
	)};

	socket.on('recv_privatemsg', updateChat);
}]);