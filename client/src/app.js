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