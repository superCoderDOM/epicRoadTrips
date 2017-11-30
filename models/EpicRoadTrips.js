const mongoose = require('mongoose');
Schema = mongoose.Schema;

// create Optimized Road Trip schema
const EpicRoadTripSchema = new Schema({
    epicRoadTrip: [ {type: String, required: true} ],
    totalTripDistance: {type: Number, required: true},
    totalTripDuration: {type: Number, required: true},
    created: {type: Date, required: true},
    updated: {type: Date, required: true},
});

// create Optimized Road Trip model
const EpicRoadTripModel = mongoose.model('EpicRoadTrips', EpicRoadTripSchema);

module.exports = EpicRoadTripModel;