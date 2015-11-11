// mongoose Connection
var mongoose = require('mongoose');
// Require user schema JS file
var fbUserSchema = require('./db.facebookUserSchema').fbUserSchema;
// User Model
var fbUser = mongoose.model('fbUserM', fbUserSchema);

// Add user function
var addUser = function (userObj, callback) {
    
    // Connect if not connected already
    if (!mongoose.connection.readyState) {
        mongoose.connect("mongodb://noamr:bellalin23@ds027744.mongolab.com:27744/bulletin");
    }
    
    var conn = mongoose.connection;
    // Add circles to user.
    userObj.circles = [];
    
    if (userObj.hometown != null)
        userObj.circles.push(userObj.hometown.name);
    
    if (userObj.gender != null)
        userObj.circles.push(userObj.gender);
    
    // Add an empty event array for user.
    userObj.events = [];
    // add empty categories array for user.
    // add empty circles array for user.
    console.log('userObj.friendsList', userObj.friendsList)
    if (userObj.friendsList != null && userObj.friendsList.length > 0) {
        userObj.friendsList.forEach(function (value, key) {
            value.categories = [];
            value.circles = [];
            
            if (value.hometown != null) {
                value.circles.push({ value: value.hometown.name });
            }
            
            if (value.gender != null) {
                value.circles.push({ value: value.gender });
            }

        });
    }
    
    
    
    
    // Adding new user from facebook to User's collection
    var newUser = new fbUser({
        userObject: userObj
    });
    
    var query = fbUser.findOne().where('userObject.email', userObj.email);
    query.exec(function (err, user) {
        if (err) {
            console.log('err', err);
        } else {
            if (user == null) {
                newUser.save(function (err, doc) {
                    if (err) {
                        console.log("err", err);
                    } else {
                        console.log("\nUser was added to faceboobUsers collection");
                        callback(newUser);
                    }
                });
            } else {
                callback(user);
            }
        }
    });
};

    
// Exports
exports.addUser = addUser;
