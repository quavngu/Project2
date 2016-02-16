"use strict";

angular.module("chatApp", ["ui.bootstrap"]).config(function($routeProvider) {
	$routeProvider.when("/login", {
		templateUrl: "src/login/login.html",
		controller: "LoginController"
	}).
	when("/room/:id" {
		templateUrl: "src/room/room.html",
		controller: "RoomController"
	}).
	otherwise ({
		// TODO
	})
});