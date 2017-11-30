const mongoose = require('mongoose');
Schema = mongoose.Schema;

// create Distance Matrix schema
const distanceMatrixSchema = new Schema({
    waypoint1: {type: String, required: true},
    waypoint2: {type: String, required: true},
    distance_m: {type: Number, required: true},
    duration_s: {type: Number, required: true},
});

// create Route schema
const routeSchema = new Schema({
    distance_matrix: [ distanceMatrixSchema ],
    created: {type: Date, required: true},
    updated: {type: Date, required: true},
});

// create Distancex Matri model
const DistanceMatrixModel = mongoose.model('DistanceMatrix', routeSchema);

module.exports = DistanceMatrixModel;