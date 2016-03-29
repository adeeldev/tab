app.controller('userController', ['$scope', '$location' , '$http', 'userService', function($scope, $location, $http, userService) {

    console.log('in user controller');

    $scope.signup = function(user){  
    	// console.log(user);
    	var userData = {
    		username : user.name,
    		email 	 : user.email,	
    		password : user.password

    	}
        userService.register(userData)
        .then(function (response){
            console.log(response);
            //$location.path('/app/dashboard');
            console.log(response.data);
            if(response.data.length == 0){
                $scope.response = true;
            }else{
                console.log(response);
                $location.path('/app/dashboard'); 
            }
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;              
            }
        })
    };


    $scope.getUsersList = function(){

        userService.getUsersList()
        .then(function (response){
            console.log(response);
            //$location.path('/app/dashboard');
            console.log(response.data);
            if(response.data.length == 0){
                $scope.response = true;
            }else{
                $scope.users = response.data;
            }
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;              
            }
        })
    }

    $scope.delete = function(userId){

        userService.deleteUser(userId)
        .then(function (response){
            userService.getUsersList()
            .then(function (response){
                console.log(response);
                //$location.path('/app/dashboard');
                console.log(response.data);
                if(response.data.length == 0){
                    $scope.response = true;
                }else{
                    $scope.users = response.data;
                }
            })
            .catch(function (err){
                if(err.status == 500){
                    $scope.serverError = true;              
                }
            })
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;              
            }
        })

    }    


}]);
