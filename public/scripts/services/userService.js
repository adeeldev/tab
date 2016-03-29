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

	}])