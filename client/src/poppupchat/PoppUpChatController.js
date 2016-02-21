angular.module("chatApp").controller("PoppUpChatController", ["$scope", "socket", "$location", "$routeParams",
function PoppUpChatController($scope, socket, $location, $routeParams) {
	$scope.privateMessages = [];

	$scope.answerUser = function answrUser(user) {
		var path = "/private/" + user;
		$location.path(path);
	};

	var getPrvtMsg = function(username, message) {
		$scope.privateMessages.push({'nick': username, 'message': message})
		if ($scope.privateMessages.length > 5) {
			console.log("hahah");
			$scope.privateMessages.splice(0,1);
		}
	};

	socket.on('recv_privatemsg', getPrvtMsg);

}]);