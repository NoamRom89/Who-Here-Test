var mongoose = require('mongoose');
var schema = mongoose.Schema;

//Users schema  - document
var fbUserSchema = new schema({
    userObject: Object
}, { collection: 'facebookUsers' });

//Exports
exports.fbUserSchema = fbUserSchema;
