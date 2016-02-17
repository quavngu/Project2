"use strict";

angular.module("chatApp").controller("RoomListController", ["$scope", "socket",
function RoomListController($scope, socket) {
	$scope.testvar = "bla";
	socket.emit("rooms");

	var funcToBeCalledWhenRommlistChanges = function(roomlist) {
		console.log(roomlist);
		$scope.$apply(function() {
			$scope.roomlist = roomlist;
		});
	}

	socket.on("roomlist", funcToBeCalledWhenRommlistChanges);
}]);