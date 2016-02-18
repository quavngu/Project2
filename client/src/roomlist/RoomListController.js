"use strict";

angular.module("chatApp").controller("RoomListController", ["$scope", "socket",
function RoomListController($scope, socket) {
	$scope.testvar = "bla";
	socket.emit("rooms");

	$scope.createRoom = function createRoom() {
		console.log("create room");
		var roomobj = {room: undefined, pass: undefined};
		socket.emit("joinroom", roomobj, function(accepted, reason) {
			if (!accepted) {
				$scope.errorMessage = reason;
			}
			else {
				console.log(reason);
				console.log(accepted);
				console.log("room created");
			}
		});
	}

	var funcToBeCalledWhenRommlistChanges = function(roomlist) {
		console.log("herro");
		console.log(roomlist);
		//$scope.apply(function() {
			$scope.roomlist = roomlist;
		//});
	}

	socket.on("roomlist", funcToBeCalledWhenRommlistChanges);
}]);