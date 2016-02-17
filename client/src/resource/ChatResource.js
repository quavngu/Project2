"use strict";

angular.module("chatApp").factory("ChatResource",
function ChatResource(){
	return {
		login: function login(user, callback) {
			socket.emit("adduser", user, function(available){
    			if (available){
       				console.log("user is available");
    			} else {
    				console.log("user is not available");
    			}
			});
		},

		getRoomList: function getRoomList(callback) {
			// TODO:
		}
	};
});