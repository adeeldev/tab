var express = require('express'),
	router = express.Router(),
	adminModel = require('../models/adminModel'),
	moment = require('moment'),
	helperFun = require('../lib/helperFunc'),
	md5 = require('md5');
router.get('',function (request,response){
	adminModel.find({},{"__v" : 0, "password" : 0, "emailCode" : 0},function (err,result){
		if(err){
			return response.status(500).send({"message" : "Internal Server Error" , "err" : err}).end();
		}
		response.status(200).send(result).end();
	})
})
router.get('/list', function (request, response){
			adminModel.find({},function (err, user){	
			if(err){
					response.status(400).send({"message" : err}).end();
			}
			if(user){
					return response.status(200).send({'status':'200' ,'data' : user}).end();
			}	
		})
});

router.post('/getAdvertiser', function (request, response){
		var id = request.body.id;
		adminModel.find({'_id': id},function (err, user){	
			if(err){
					response.status(400).send({"message" : err}).end();
			}
			console.log(user);
			if(user){
					return response.status(200).send(user).end();
			}	
		})
});

router.post('/login', function (request, response){ 
		var data = {
			"email" : request.body.email,
			"password" : request.body.password,
			"provider" : request.body.provider
		};
		var deviceInfo = {
			deviceId : request.body.deviceId,
			deviceName : request.body.deviceName
		};
		if((data.email == null || "") && (data.password == null || "")){
			response.status(400).send({"status":"404","message" : "Parameters are missing."}).end();
		}else{
			adminModel.login(data,deviceInfo)
			.then(function(result){
				console.log("Successfully Logged In...");
				if(result.code == 'IC'){
					response.status(400).send({"message" : result.message}).end();
				}else{
					response.status(200).send({data : result}).end();
				}
			})
			.catch(function(err){
				console.log("Login Unsuccessful...");
				response.status(500).send({"message" : "Server Error. Please try again later...", "err" : err});
			})

		}
});

router.post('/login/social', function (request, response){ 
		var data = {
			"email" : request.body.email,
			"accessToken" : request.body.accessToken,
			"provider" : request.body.provider
		};
		var deviceInfo = {
			deviceId : request.body.deviceId,
			deviceName : request.body.deviceName
		};
		if((data.email == null || "") && (data.password == null || "")){
			response.status(400).send({"status":"400", "message" : "Parameters are missing."}).end();
		}else{
			adminModel.login(data,deviceInfo)
			.then(function(result){
				console.log("Successfully Logged In...");
				if(result.code == 'IC'){
					response.status(404).send({"status":"404","message" : result.message}).end();
				}else{
					response.status(200).send({data : result}).end();
				}
			})
			.catch(function(err){
				console.log("Login Unsuccessful...");
				response.status(500).send({"message" : "Server Error. Please try again later...", "err" : err});
			})

		}
});
router.post('/register', function (request,response){
	console.log('in Express controller');
	console.log(request.body);
	var data = {
		username : request.body.username,
		password : request.body.password,
		email 	 : request.body.email,
		province : request.body.province,
		country : request.body.country,
		city : request.body.city,
		phone : request.body.phone,
		zipCode : request.body.zipCode,
		paymentType : request.body.paymentType,
		creditType : request.body.creditType,
		paymentType : request.body.paymentType,
		creditLimit : request.body.creditLimit

	}
	if((data.username == null || "") && (data.password == null || "") && (data.email == null || "")){
		response.status(400).send({"message" : "Parameters are missing."}).end();
	}else{
		//SARUH23500001
		adminModel.findOne({ $and:[ {'email':data.email}, {'email': data.email} ]},function (err, user){	
			if(err){
					response.status(400).send({"message" : err}).end();
			}
			if(user){
					return response.status(400).send({'status':'404' ,'message' : 'Username and Email already exists'}).end();
			}	
			adminModel.register(data)
			.then(function (result){
				response.status(200).send({"status" : "200", "user" : result.user}).end();
			})
			.then(function (data){
				console.log("Email is send to the user.");
			})
			.catch(function (error){
				if(error.code == "U-Reg"){
					//if had error in userRegistration
					if(error.err.code == 11000){	//if user Already exist
						var message = error.err.message.split('{');
						errorKey = message[1].replace('}',"");
						errorKey = errorKey.replace(':',"");
						errorKey = errorKey.split('"').join('') + ' Already exist.';
						return response.status(400).send({"message" : errorKey}).end();
					}
					response.status(500).send({"message" : "Server Error. Please try agian later...", "err" : error}).end();
				}else if(error.code == "SM:Err"){
					//if had error error in sending mail
					console.log(error);
					console.log("Email Not send.");
				}else{
					console.log("Other Error : "+ error);
				}
			})
		})
	}
	
});

router.post('/register/facebook', function (request,response){
	var data = {
		username : request.body.username,
		accessToken : request.body.accessToken,
		email : request.body.email,
		provider : request.body.provider
	}
	if((data.username == null || "") && (data.accessToken == null || "") && (data.email == null || "") && (data.provider == null || "")){
		response.status(400).send({"message" : "Parameters are missing."}).end();
	}else{
		adminModel.findOne({ $and:[ {'email':data.email}, {'provider': data.provider} ]},function (err, user){	
			if(err){
					response.status(400).send({"message" : err}).end();
			}
			console.log(user);
			if(user){
					return response.status(400).send({'status':'404' ,'message' : 'email and provider already exists'}).end();
			}	
			adminModel.register(data)
			.then(function (result){
				response.status(200).send({"status" : "200", "user" : result.user}).end();
			})
			.then(function (data){
				console.log("Email is send to the user.");
			})
			.catch(function (error){
				if(error.code == "U-Reg"){
					//if had error in userRegistration
					if(error.err.code == 11000){	//if user Already exist
						var message = error.err.message.split('{');
						errorKey = message[1].replace('}',"");
						errorKey = errorKey.replace(':',"");
						errorKey = errorKey.split('"').join('') + ' Already exist.';
						return response.status(400).send({"message" : errorKey}).end();
					}
					response.status(500).send({"message" : "Server Error. Please try agian later...", "err" : error}).end();
				}else if(error.code == "SM:Err"){
					//if had error error in sending mail
					console.log(error);
					console.log("Email Not send.");
				}else{
					console.log("Other Error : "+ error);
				}
			})
		})
	}
	
});

router.post('/register/google', function (request,response){
	var data = {
		username : request.body.username,
		accessToken : request.body.accessToken,
		email : request.body.email,
		provider : request.body.provider
	}
	if((data.username == null || "") && (data.accessToken == null || "") && (data.email == null || "") && (data.provider == null || "")){
		response.status(400).send({"message" : "Parameters are missing."}).end();
	}else{
		adminModel.findOne({ $and:[ {'email':data.email}, {'provider': data.provider} ]},function (err, user){	
			if(err){
					response.status(400).send({"message" : err}).end();
			}
			if(user){
					return response.status(400).send({'status':'404' ,'message' : 'email and provider already exists'}).end();
			}	
			adminModel.register(data)
			.then(function (result){
				response.status(200).send({"status" : "200", "user" : result.user}).end();
			})
			.then(function (data){
				console.log("Email is send to the user.");
			})
			.catch(function (error){
				if(error.code == "U-Reg"){
					//if had error in userRegistration
					if(error.err.code == 11000){	//if user Already exist
						var message = error.err.message.split('{');
						errorKey = message[1].replace('}',"");
						errorKey = errorKey.replace(':',"");
						errorKey = errorKey.split('"').join('') + ' Already exist.';
						return response.status(400).send({"message" : errorKey}).end();
					}
					response.status(500).send({"message" : "Server Error. Please try agian later...", "err" : error}).end();
				}else if(error.code == "SM:Err"){
					//if had error error in sending mail
					console.log(error);
					console.log("Email Not send.");
				}else{
					console.log("Other Error : "+ error);
				}
			})
		})
	}
	
});

// router.post('/verify',function (request,response){
// 	var user_id = request.body.id,
// 		code = request.body.code;
// 	if((user_id == null || "") || (code == null || "")){
// 		response.status(400).send({"message" : "Parameters are missing."}).end();
// 	}else{
// 		userModel.verifyCode(user_id,code)
// 		.then(function (result){
// 			console.log("Result : " + result);
// 			response.status(200).send(result).end();
// 		}).catch(function (err){
// 			console.log("Error : " + err);
// 			if (err.code === 1) {
// 				response.status(500).send({"message" : "Database Err. Please try again later", "err" : err}).end();
// 			} else{
// 				response.status(400).send({"message" : err.text}).end();
// 			}
// 		})
// 	}
// });

router.post('/verify',function (request,response){
	var code = request.body.code;
	if((code == null || "")){
		response.status(400).send({"message" : "Parameters are missing."}).end();
	}
	verifyModel.findOne({'emailCode':code},function (err, result){
		if(err){
			return response.status(500).send({"message": "Internal Server Error","err" : err}).end();
		}
		if(result == null){
			return response.status(400).send({"message": "Invalid Verification Code"}).end();
		}

		var data = {
			username : result.username,
			password : result.password,
			email : result.email,
			address : request.body.address,
			payment_method : request.body.payment_method,
			dateCreated : result.dateCreated,
			isVerified : true,
			emailCode : result.emailCode,
			notify : true



		}
		var newUser = new userModel(data);
		// userModel.emailCode = helperFun.randomCode(6);
		newUser.save(function (err,newUser){
			if(err){
				return response.status(500).send({"message": "Internal Server Error","err" : err}).end();
			}
				return response.status(200).send(newUser).end();			
		})
	});	
});
router.post('/removeUser', function (request,response){
	var _id = request.body.user_id;
	if(_id == null || ""){
		response.status(400).send({"message": "Parameter Missing"}).end();
	}else{
		adminModel.findOneAndRemove({"_id" : _id},function (err,result){
			if(err){
				console.log("An Error has occured." + err);
				return response.status(500).send({"message" : "Server Error . Please try Agin Later." , "err" : err}).end();
			}
			response.status(200).send({"message" : "Deleted Successfully."}).end();
		});
	}
});
router.post('/forgotPass',function (request,response){
	var email = request.body.email,
		deviceType = request.body.deviceType;
	if((email == "" || null) || (deviceType != "Android" && deviceType != "Apple")){
		return response.status(400).send({"message": "Parameter Missing OR Invalid Parameter"}).end();
	}
	adminModel.findOne({'email':email},function (err, result){
		if(err){
			return response.status(500).send({"message": "Internal Server Error","err" : err}).end();
		}
		if(result == null){
			return response.status(400).send({"message": "Invalid Email"}).end();
		}
		result.emailCode = helperFun.randomCode(6);
		result.save(function (err,newUser){
			if(err){
				return response.status(500).send({"message": "Internal Server Error","err" : err}).end();
			}
			var message = "Please Click this link to change your password : ",
				subject = "Forget Password Request";
			if(deviceType == "Android"){
				message = message + "http://test.com/" + email + "/" + newUser.emailCode;
			}else{
				message = message + "http://test.com/" + email + "/" + newUser.emailCode;
			}
			helperFun.emailSender(email,message,subject)
			.then(function(result){
				response.status(200).send({"message":"emailsend"}).end();
			}).catch(function (err){
				response.status(500).send({"message":"Internal Server Error.", "err" : err});
			})
		})
	});
});
router.post('/changePassword',function (request,response){
	var password = request.body.password,
		email = request.body.email,
		code = request.body.code;
	if((password == null || '') || (password == null || '') || (code == null || '')){
		return response.status(400).send({"message" : "Parameter Missing"}).end();
	}
	adminModel.findOne({"email" : email, "emailCode" : code},function (err,User){
		if(err){
			return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
		}
		if(User == null){
			return response.status(400).send({"message" : "Invalid Email OR Code"}).end();
		}
		User.password = md5(password);
		User.save(function (error,result){
			if(error){
				return response.status(500).send({"message" : "Internal Server Error", "err" : error}).end();
			}
			delete result.__v;
			response.status(200).send(result).end();	
		})
	})
});
router.post('/update', function (request,response){

	var data = request.body;
	console.log(data.uid);
	var user_id = data.uid,
		address = data.address,
		province = data.province,
		country = data.country,
		city = data.city,
		phone = data.phone,
		zipCode = data.zip,
		paymentType = data.paymentType,
		creditType = data.creditType,
		paymentType = data.paymentType,
		creditLimit = data.creditLimit;
	if((data.uid == null || "")){
		response.status(400).send({"message" : "Parameters are missing."}).end();
	}else{
	adminModel.findOne({"_id" : user_id},function (err,User){
		if(err){
			return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
		}
		if(User == null){
			return response.status(400).send({"message" : "Invalid Email OR Code"}).end();
		}
		console.log(User);
		User.province = province;
		User.country = country;
		User.city = city;
		User.address = address;
		User.phone = phone;
		User.zipCode = zipCode;
		User.paymentType = paymentType;
		User.creditType = creditType;
		User.creditLimit = creditLimit;
		User.save(function (error,result){
			if(error){
				return response.status(500).send({"message" : "Internal Server Error", "err" : error}).end();
			}
			// var message = "Your User name is updated.Your new Username is : " + result.username;
			// var subject = "Profile Update";
			// helperFun.emailSender(result.email, message, subject)
			// 	.then(function (result){
			// 		console.log("Email is sent.");
			// 	})
			// 	.catch(function (error){
			// 		console.log(error);
			// 	})
			delete result.__v;
			response.status(200).send(result).end();	
		})
	})
	}
});

router.post('/code', function (request,response){
	var data = request.body;
	var user_id = data.uid,
		code = data.code;

	if((data.username == null || "") && (data.code == null || "") ){
		response.status(400).send({"message" : "Parameters are missing."}).end();
	}else{
	adminModel.findOne({"_id" : user_id},function (err,User){
		if(err){
			return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
		}
		if(User == null){
			return response.status(400).send({"message" : "Invalid Email OR Code"}).end();
		}
		User.code = code;
		User.save(function (error,result){
			if(error){
				return response.status(500).send({"message" : "Internal Server Error", "err" : error}).end();
			}
			var message = "Your User name is updated.Your new Username is : " + result.username;
			var subject = "Profile Update";
			// helperFun.emailSender(result.email, message, subject)
			// 	.then(function (result){
			// 		console.log("Email is sent.");
			// 	})
			// 	.catch(function (error){
			// 		console.log(error);
			// 	})
			delete result.__v;
			response.status(200).send(result).end();	
		})
	})
	}
});

router.post('/switchNotify', function (request,response){
	var id = request.body.id;
	var action = request.body.action;
	if((id == "" || null) || (action == '' || null)){
		return response.status(400).send({'message' : "Parameters are missing"}).end();
	}
	adminModel.findOne({"_id" : id},function (error,user){
		if(error){
			return response.status(500).send({'message' : "Internal Server error. Please try again later.",'err' : error}).end();
		}
		if(user == null){
			return response.status(400).send({'message' : "Invalid User ID"}).end();	
		}
		user.notify = action;
		user.save(function (err, updatedUser){
			if(err){
				return response.status(500).send({'message' : "Internal Server error. Please try again later.",'err' : err}).end();
			}
			response.status(200).send({'user' : updatedUser}).end();
		})
	});
});

module.exports = router;
