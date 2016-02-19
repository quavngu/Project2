"use strict";

angular.module("chatApp").controller("RoomController", ["$scope", "socket", "$location", "$routeParams",
function RoomController($scope, socket, $location, $routeParams) {
	$scope.id = $routeParams.id;
	$scope.users = []
	$scope.messages = [];
	$scope.ops = [];
	socket.emit("rooms");
	var roomobj = {room: $scope.id, pass: undefined};
	socket.emit("joinroom", roomobj, function(accepted, reason) {
		if (!accepted) {
			console.log(reason);
		} else {
			console.log("JOINED ROOM");
		}
	});

	var getRoom = function(rooms) {
		console.log("getting room");
		$scope.room = rooms[$scope.id];
		console.log("printing messages");
		/*for(var m in $scope.room.messageHistory) {
			console.log($scope.room.messageHistory[m]);
			messages.push({'date': $scope.room.messageHistory[m].timestamp, 'nick': $scope.room.messageHistory[m].nick, 'message': $scope.room.messageHistory[m].message});
			console.log(messages[m]);
		}*/
	};
	
	var enterOrLeave = function(message, room, username) {
		console.log("EEEEEE" + message);
		if (message === "join") {
			console.log("hey there");
			$scope.id = $routeParams.id;
		} else {
			console.log("left room");
			$location.path("/roomlist");
		}
	};

	var updateChat = function(roomName, messageHistory) {
		if (roomName === $scope.id) {
			$scope.messages = [];
			for(var m in messageHistory) {
				console.log(messageHistory[m]);
				$scope.messages.push({'date': messageHistory[m].timestamp, 'nick': messageHistory[m].nick, 'message': messageHistory[m].message});
				console.log($scope.messages[m]);
			}
		}
	};

	var updateUsers = function(room, users, ops) {
		if (room === $scope.id) {
			$scope.users = users;
			$scope.ops = ops;
		}
	};

	$scope.partRoom = function partRoom() {
		console.log("room peing parted");
		socket.emit("partroom", $scope.id);
	};

	$scope.sendMessage = function sendMessage() {
		var data = {'roomName': $scope.id, 'msg': $scope.message};
		console.log(data.roomName + " " + data.msg);
		socket.emit("sendmsg", data);
	};

	socket.on('updatechat', updateChat);

	socket.on('servermessage', enterOrLeave);

	socket.on('roomlist', getRoom);

	socket.on('updateusers', updateUsers);

	//socket.on('updateusers', room, rooms[room].users, rooms[room].ops);
	
}]);