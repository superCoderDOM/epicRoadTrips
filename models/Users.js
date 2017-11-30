const mongoose = require('mongoose');
      Schema = mongoose.Schema;

// create User Trip schema
const TripSchema = new Schema({
    trip_name: {type: String, required: true},
    waypoint_list: {type: Array, required: true},
    optimized_route: {type: Array, required: true},
    estimated_travel_distance: {type: Number, required: true},
    estimated_travel_duration: {type: Number, required: true},
    image_url: {type: String},    
    created: {type: Date, required: true},
    updated: {type: Date, required: true},
});

// create User schema
const userSchema = new Schema({
    email: {type: String, lowercase: true, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    created: {type: Date, required: true},
    updated: {type: Date, required: true},
    trips: [ TripSchema ],
}, { runSettersOnQuery: true });

// create User model
const UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;