angular.module('TurkishApp')
	.controller('adminController',['$scope','$location','$uibModal','$rootScope','adminService','$cookies',function ($scope,$location,$uibModal,$rootScope,adminService,$cookies){
		$scope.animationsEnabled = true;
		$scope.error = false;
		$scope.uid = $cookies.get('user');
		$scope.type = $cookies.get('type');

		$scope.login = function login(){
			adminService.login($scope.Admin)
				.then(function (result){
					$cookies.put('user',result.data._id);
					$cookies.put('type',result.data.type);
					$rootScope.loggedIn = true;
					$rootScope.Admin = result.data;
					$rootScope.loggedIn = true;
					$scope.uid = $cookies.get('user');
					$scope.type = $cookies.get('type');
					$rootScope.typei = $scope.type;
					$location.path('/home');
				})
				.catch(function (response){
					$scope.error = true;
					$scope.errorMsg = response.data.message;
				})
		}

		$scope.prompt = function(size){
			var data = {
				'admin' : $rootScope.Admin,
				'action' : 'Verification'
			};
			var modalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : '/views/promptModalView.html',
				controller : 'promptModalController',
				size : size,
				resolve : {
					package : function (){
						return data;
					}
				}
			})
			modalInstance.result
			.then(function() {
				console.log("Ok");
		    })
		}

		$scope.logout = function(){
			$cookies.remove("user");
			$scope.uid = undefined;
			$location.path('/');

		}		
	}])