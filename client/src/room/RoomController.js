"use strict";

angular.module("chatApp").controller("RoomController", ["$scope", "socket", "$location", "$routeParams",
function RoomController($scope, socket, $location, $routeParams) {
	$scope.id = $routeParams.id;
	$scope.users = [];
	$scope.messages = [];
	$scope.ops = [];
	$scope.username = "";
	$scope.selectedUser = "";
	$scope.bannedMessage = "";
	socket.emit("rooms");
	var roomobj = {room: $scope.id, pass: undefined};
	socket.emit("joinroom", roomobj, function(accepted, reason) {
		if (!accepted) {
			console.log(reason);
			$scope.bannedMessage = "You are banned from the chat";
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
			if ($scope.username === "") {
				$scope.username = username;
			}
		} else {
			console.log("left room");
			console.log($scope.username);
			if (username === $scope.username)
			{
				$location.path("/roomlist");
			}
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

	var getKicked = function(room, user, username) {
		if (room === $scope.id && user === $scope.username) {
			console.log(username + " has kicked u mafagga");
			$location.path("/roomlist");
		}
	};

	var setNewTopic = function(room, topic, username) {
		if (room === $scope.id) {
			$scope.room.topic = topic;
		}
	}

	$scope.editTopic = function editTopic() {
		var topicObj = {'room': $scope.id, 'topic': $scope.roomtopic};
		socket.emit('settopic', topicObj, function(accepted) {
			if (accepted) {
				console.log("topic changed");
			}
		})
	}

	$scope.partRoom = function partRoom() {
		console.log("room peing parted");
		socket.emit("partroom", $scope.id);
	};

	$scope.sendMessage = function sendMessage() {
		if($scope.message !== "") {
			var data = {'roomName': $scope.id, 'msg': $scope.message};
			console.log(data.roomName + " " + data.msg);
			$scope.message = "";
			socket.emit("sendmsg", data);
		}	
	};

	$scope.kickUser = function kickUser(selectedUser) {
		var kickObj = {'room': $scope.id, 'user': selectedUser};
		console.log(kickObj);
		socket.emit('kick', kickObj, function(success) {
			if (!success) {
				$scope.errorMessage = "Could not kick";
			}
		});
	};

	$scope.banUser = function banUser(selectedUser) {
		var banObj = {'room': $scope.id, 'user': selectedUser};
		console.log(banObj);
		socket.emit('ban', banObj, function(success) {
			if (!success) {
				$scope.errorMessage = "Could not ban";
			}
		});
	};

	socket.on('updatetopic', setNewTopic);

	socket.on('updatechat', updateChat);

	socket.on('servermessage', enterOrLeave);

	socket.on('roomlist', getRoom);

	socket.on('updateusers', updateUsers);

	socket.on('kicked', getKicked);

	socket.on('banned', getKicked);


	//socket.on('updateusers', room, rooms[room].users, rooms[room].ops);
	
}]);