"use strict";

angular.module("chatApp", ["ngRoute"]).config(function($routeProvider) {
	$routeProvider
	.when("/login", {
		templateUrl: "src/login/login.html",
		controller: "LoginController"
	})
	.when("/room/:id", {
		templateUrl: "room/room.html",
		controller: "RoomController"
	})
	.when("/roomlist", {
		templateUrl: "src/roomlist/roomlist.html",
		controller: "RoomListController"
	})
	.otherwise ({
		redirectTo: "/login"
	});
});