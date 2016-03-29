angular.module('app')
	.service('userService',['$http','$location',function ($http,$location){
		var URL = 'http://' + $location.host() + ":" + $location.port() + '/users';
		var req = {};
	 
		this.register = function (data){ 
			req = {
				'method' : 'POST',
				'url' : URL + '/register',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}  


		this.getUsersList = function (data){ 
			var req = {
				method : "get",
				url :  URL + '/list',
				headers : {
					"Content-Type" : "application/json"
				}
			}
			return $http(req);
		}  


		this.deleteUser = function (data){ 
			var user = {'user_id': data}
			req = {
				'method' : 'POST',
				'url' : URL + '/removeUser',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : user
			}
			return $http(req);
		}  


	}])