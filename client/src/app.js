"use strict";

angular.module("chatApp", []);
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
	.otherwise ({
		redirectTo: "/login/login.html"
	});
});