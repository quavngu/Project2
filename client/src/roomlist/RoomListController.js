"use strict";

angular.module("chatApp").controller("RoomListController", ["$scope", "socket", "$location",
function RoomListController($scope, socket, $location) {
	socket.emit("rooms");
	$scope.roomlist = {};
	$scope.roomnames = [];

	$scope.createRoom = function createRoom() {
		console.log("create room");
		var roomobj = {room: $scope.roomname, pass: undefined};
		socket.emit("joinroom", roomobj, function(accepted, reason) {
			if (!accepted) {
				$scope.errorMessage = reason;
			}
			else {
				console.log("room created");
				var path = "room/" + $scope.roomname;
				$location.path(path);
			}
		});
	}

	var funcToBeCalledWhenRommlistChanges = function(roomlist) {
		console.log("herro");
		console.log(roomlist);
		//$scope.apply(function() {
		$scope.roomlist = roomlist;
		$scope.roomnames = Object.keys(roomlist);
		//});
	}

	/*socket.on("roomlist", rooms, function() {
		$scope.roomlist = rooms;
	});*/

	socket.on("roomlist", funcToBeCalledWhenRommlistChanges);
}]);