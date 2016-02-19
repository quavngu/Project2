"use strict";

angular.module("chatApp").controller("RoomController", ["$scope", "socket", "$location", "$routeParams",
function RoomController($scope, socket, $location, $routeParams) {
	var id = $routeParams.id;
	console.log(id);
	$scope.room = id;
	$scope.messages = [];
	$scope.user = "";
	$scope.users = {};
	$scope.ops = {};
	$scope.topic = "";
	

	var enterOrLeave = function(message, room, username) {
		console.log("EEEEEE" + message);
		if (message === "join") {
			console.log("hey there");
			id = $routeParams.id;
			$scope.room = id;
			$scope.messages = room.messageHistory;
			$scope.user = username;
			$scope.users = room.users;
			$scope.ops = room.ops;
			$scope.topic = room.topic;

			for(m in room.messages) {
				console.log(m);
			}
			//console.log($scope.messages);
		} else {
			console.log("left room");
			$location.path("/roomlist");
		}

	};
	socket.on('servermessage', enterOrLeave);

	$scope.partRoom = function partRoom() {
		console.log("room peing parted");
		socket.emit("partroom", $scope.room);
	};

	$scope.sendMessage = function sendMessage() {
		var data = {'roomName': id, 'msg': $scope.message};
		console.log(data.roomName + " " + data.msg);
		socket.emit("sendmsg", data);
	};

	//socket.on('updateusers', room, rooms[room].users, rooms[room].ops);
	
}]);