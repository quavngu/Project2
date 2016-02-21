"use strict";

angular.module("chatApp").controller("RoomListController", ["$scope", "socket", "$location",
function RoomListController($scope, socket, $location) {
	socket.emit("rooms");
	$scope.roomlist = {};
	$scope.roomnames = [];
	$scope.privateMessages = [];

	$scope.createRoom = function createRoom() {
		var roomobj = {room: $scope.roomname, pass: undefined};
		if($scope.roomname !== undefined) {
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
	};

	var funcToBeCalledWhenRommlistChanges = function(roomlist) {
		$scope.roomlist = roomlist;
		$scope.roomnames = Object.keys(roomlist);
	};

	socket.on("roomlist", funcToBeCalledWhenRommlistChanges);

}]);