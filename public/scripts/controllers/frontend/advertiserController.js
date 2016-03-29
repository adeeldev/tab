app.controller('advertiserController', ['$scope', '$location', '$http', 'adminService', function($scope, $location, $http, adminService) {



    var pathArray = $location.url().split('/') ;
    $scope.id = pathArray[3];
    $scope.getAdvertisers = function(){
        console.log('in advertisers');
        // Find a list of Advertisers
        adminService.list()
        .then(function (response){
            console.log(response.data);
            if(response.data.length == 0){
                $scope.response = true;
            }else{
                $scope.advertisers = response.data;
            }
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;              
            }
        })
    }

    $scope.paymentTime = function(type){
    	console.log(type);
    	if(type == 'credit'){
    		$scope.credit = 'true';	
    	}
    }

    $scope.creditType = function(type){
    	console.log(type);
    	if(type == 'limited'){
    		$scope.limited = 'true';	
    	}
    }  

    $scope.save = function(data){
    	var advertiser = {
    			username: data.name,
    			country: data.country,
    			email: data.email,
    			address: data.address,
    			phone: data.phone,
    			province: data.province,
    			zip: data.zip,
    			paymentType: data.type,
    			limited: data.limited,
    			creditLimit: data.creditLimit,
    			userType: 'advertiser'

    		}
        adminService.register(advertiser)
        .then(function (response){
            console.log(response.data);
            if(response.data.length == 0){
                $scope.response = true;
            }else{
                $scope.getPromotions();
                $scope.promotionResult = promotionResult.data;
            }
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;              
            }
        })
    }

    $scope.editAdvertiser = function(){

    adminService.getAdvertiser($scope.id)
        .then(function (response){
            $scope.adverInfo = response.data;
            console.log($scope.adverInfo);
        })
        .catch(function (err){
            console.log(err);
        })
    }

    $scope.update = function(data){

        console.log(data.zip);
        var advertiser = {
                uid : $scope.id,
                country: data.country,
                address: data.address,
                phone: data.phone,
                province: data.province,
                zip: data.zipCode,
                paymentType: data.type,
                limited: data.limited,
                creditLimit: data.creditLimit,
                userType: 'advertiser'

            }
        console.log(advertiser);
        adminService.update(advertiser)
        .then(function (response){
            console.log(response.data);
            if(response.data.length == 0){
                $scope.response = true;
            }else{
                $location.path('/app/analysis');                
            }
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;              
            }
        })        
    }

}]);
