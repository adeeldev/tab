var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var md5 = require('md5');

var userSchema = new mongoose.Schema({
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
	provider: {
		type: String,
		required: true
	},
	gender: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	userPoints: {
		type: Number,
		default: 0
	},
	country:{
		type: String
	},
	birthday:{
		type:String
	},
	verifyCode: {
		type: String
	},
	deviceName: {
		type: String
	},
	deviceId: {
		type: String
	},
	createdAt: {
		type: Date
	},
	updatedAt: {
		type: Date
	},
	code: {
		type: String
	}
});



userSchema.statics.login = function login(data, deviceInfo) {
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

userSchema.statics.register = function register(data){
	data.password = md5(data.password);
	var newUser = new (mongoose.model('UserModel'))(data);
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




var userModel = mongoose.model('UserModel', userSchema);
module.exports = userModel;