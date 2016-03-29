// angular.module('app').factory('adminService', ['$resource',
// 	function($resource) {
// 		return $resource('/admin', { userId: '@_id'
// 		}, {
// 			update: {
// 				method: 'PUT'
// 			}
// 		});
// 	}
// ]);



angular.module('app')
	.service('adminService',['$http','$location',function ($http,$location){
		var URL = 'http://' + $location.host() + ":" + $location.port() + '/admin';
		var req = {};

		this.list = function(){
			var req = {
				method : "get",
				url :  URL,
				headers : {
					"Content-Type" : "application/json"
				}
			}
			return $http(req);
		}		 
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
		this.getAdvertiser = function (id){
			data = {'id' : id};
			console.log(data);
			req = {
				'method' : 'POST',
				'url' : URL + '/getAdvertiser',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}    

		this.update = function (data){
			req = {
				'method' : 'POST',
				'url' : URL + '/update',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}	
	}])