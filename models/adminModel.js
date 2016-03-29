var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var md5 = require('md5');

var adminSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true
	},
	accessToken:{
		type: String
	},
	password: {
		type: String
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	gender: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	province:{
		type: String
	},
	country:{
		type: String
	},	
	city:{
		type: String
	},
	address:{
		type: String
	},	
	phone:{
		type: String
	},
	zipCode:{
		type: String
	},		
	paymentType:{
		type: String
	},
	creditType:{
		type: String
	},
	creditLimit:{
		type: String
	},
	paymentTerm: {
		type: String
	},	
	verifyCode: {
		type: String
	},
	createdAt: {
		type: Date
	},
	updatedAt: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	}
});



adminSchema.statics.login = function login(data, deviceInfo) {
	data.password = md5(data.password);
	console.log(data.password);
	var defered = Q.defer();
		console.log(data);
		this.findOne(data,{"__v" : 0}, function (err,result){
		if(result == null){
			defered.resolve({"code" : 'IC','message':'No User Found. email or password is incorrect.'});
		}else{
			if(!err){
				result.deviceId = deviceInfo.deviceId;
				result.deviceName = deviceInfo.deviceName;
				result.save(function (error, userInfo){
					if(error){
						defered.reject(false);
					}else{
						defered.resolve(userInfo);
					}
				})
			}else{
				defered.reject(false);
			}
		}
	});

	return defered.promise;
};

adminSchema.statics.register = function register(data){
	data.password = md5(data.password);
	var newUser = new (mongoose.model('AdminModel'))(data);
	var defered = Q.defer();

	newUser.save(function (err,result){
		if(err){
			defered.reject({code : "U-Reg" , err : err});
		}else{
			defered.resolve({code : "U-Reg-SU" , "user" : result});
		}
	});
	return defered.promise;
};




var adminModel = mongoose.model('AdminModel', adminSchema);
module.exports = adminModel;