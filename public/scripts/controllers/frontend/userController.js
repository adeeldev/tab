app.controller('userController', ['$scope', '$http', 'userService', function($scope, $http, userService) {

    console.log('in user controller');

    $scope.signup = function(user){  
    	// console.log(user);
    	var userData = {
    		username : user.username,
    		email 	 : user.email,	
    		password : user.password

    	}
        userService.register(userData)
        .then(function (response){
            $location.path('/app/dashboard');
            console.log(response.data);
            if(response.data.length == 0){
                $scope.response = true;
            }else{
                $location.path('/app/dashboard'); 
                $scope.getPromotions();
                $scope.promotionResult = promotionResult.data;
            }
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;              
            }
        })
    };

}]);
