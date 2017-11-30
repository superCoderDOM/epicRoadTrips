const mongoose = require('mongoose');
      Schema = mongoose.Schema;

// create Comment schema
const commentSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'Users'},
    text: {type: String, required: true},
    date: {type: Date, required: true},
});

// create Curated Trip schema
const curatedTripSchema = new Schema({
    trip_name: {type: String, required: true, unique: true},
    optimized_route: {type: Array, required: true},
    estimated_travel_distance: {type: Number, required: true},
    estimated_travel_duration: {type: Number, required: true},
    image_url: {type: String},
    vote_count: {type: Number, required: true},
    save_count: {type: Number, required: true},
    comments: [ commentSchema ],
    created: {type: Date, required: true},
    updated: {type: Date, required: true},
});

// create Curated Trip model
const CuratedTripModel = mongoose.model('CuratedTrips', curatedTripSchema);

module.exports = CuratedTripModel;