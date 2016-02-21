"use strict";

angular.module("chatApp", ["ngRoute"]).config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "src/login/login.html",
		controller: "LoginController"
	})
	.when("/login", {
		templateUrl: "src/login/login.html",
		controller: "LoginController"
	})
	.when("/room/:id", {
		templateUrl: "src/room/room.html",
		controller: "RoomController"
	})
	.when("/roomlist", {
		templateUrl: "src/roomlist/roomlist.html",
		controller: "RoomListController"
	})
	.when("/userlist", {
		templateUrl: "src/userlist/userlist.html",
		controller: "UserListController"
	})
	.when("/private/:user", {
		templateUrl: "src/chat/chat.html",
		controller: "ChatController"
	})
	.otherwise ({
		templateUrl: "src/utilities/notfound.html"
	});
});
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
		var msgObj = {'nick': $scope.otherUser, 'message': $scope.message};
		if($scope.message !== "") {
			socket.emit('privatemsg', msgObj, function(accepted) {
				if (!accepted) {
					$scope.errorMessage = "Could not send message";
				}
				else {
					var meString = "Me";
					$scope.messages.push({'nick': meString, 'message': msgObj.message});
					$scope.errorMessage = "";
				}
				$scope.message = "";
			});
		}
		
	};

	socket.on('recv_privatemsg', updateChat);
}]);
"use strict";

angular.module("chatApp").controller("LoginController", ["$scope", "$location", "$http", "socket",
function LoginController($scope, $location, $http, socket) {
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
angular.module("chatApp").controller("PoppUpChatController", ["$scope", "socket", "$location", "$routeParams",
function PoppUpChatController($scope, socket, $location, $routeParams) {
	$scope.privateMessages = [];

	$scope.answerUser = function answrUser(user) {
		var path = "/private/" + user;
		$location.path(path);
	};

	var getPrvtMsg = function(username, message) {
		$scope.privateMessages.push({'nick': username, 'message': message});
		if ($scope.privateMessages.length > 5) {
			$scope.privateMessages.splice(0,1);
		}
	};

	socket.on('recv_privatemsg', getPrvtMsg);
}]);
/*  Factory to wrap around the socket functions
    Tekið af Brian Ford
    http://briantford.com/blog/angular-socket-io.html */
angular.module('chatApp').factory('socket', ['$rootScope', function ($rootScope) {
    var socket = io.connect('http://localhost:8080');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        },
        getSocket: function() {
            return socket;
        }
    };
}]);
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
	};
	
	var enterOrLeave = function(message, room, username) {
		if (message === "join") {
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
			console.log(username + " has kicked you");
			$location.path("/roomlist");
		}
	};

	var setNewTopic = function(room, topic, username) {
		if (room === $scope.id) {
			$scope.room.topic = topic;
		}
	};

	$scope.editTopic = function editTopic() {
		var topicObj = {'room': $scope.id, 'topic': $scope.roomtopic};
		if($scope.roomtopic !== "" && $scope.roomtopic !== "No topic has been set for room..") {
			socket.emit('settopic', topicObj, function(accepted) {
				if (accepted) {
					console.log("topic changed");
				}
			});
			$scope.roomtopic = "";
		}
	};

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
}]);
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
"use strict";

angular.module("chatApp").controller("UserListController", ["$scope", "socket", "$location", "$routeParams",
function UserListController($scope, socket, $location, $routeParams) {
	socket.emit("users");
	$scope.users = {};
	$scope.usernames = [];
	$scope.errorMessage = "";

	$scope.createRoom = function cRoom() {
		console.log("create room");
	};

	$scope.answerUser = function answrUser(user) {
		var path = "/private/" + user;
		$location.path(path);
	};

	var getUserList = function(userlist) {
		$scope.users = userlist;
		$scope.usernames = Object.keys(userlist);
	};

	socket.on("userlist", getUserList);
}]);