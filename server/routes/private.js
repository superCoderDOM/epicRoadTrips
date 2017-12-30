// Server depedencies
const express   = require('express'),
      router    = express.Router();
const cors      = require('cors');
const jwt       = require('jsonwebtoken');
const mongoose  = require('mongoose');
const moment    = require('moment');

// Import Evironmental Variables
const env = require('../.env');

// Import MongoDB models
const CuratedTrips  = require('../../models/CuratedTrips');
const Users         = require('../../models/Users');

// Middleware registration
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({extended:true}));

/*====================================================
    PRIVATE TRIPS ENDPOINTS & CRUD OPERATIONS
====================================================*/

// Authorization middleware
// requires: req.headers.authorization
function logger(req, res, next){
    // log the path of the request
    // console.log('Request received:', req.originalUrl);
    // console.log(req.headers);
    // VERIFY json web token
    let tokenToValidate = req.headers.authorization;

    jwt.verify(tokenToValidate, env.EPIC_ROADTRIPS_SECRET_KEY, (err, decodedPayload) => {
        if(err){

            // turn request away if not validated
            return res.status(403);
        }
        // continue with request if validated
        // console.log(decodedPayload);
        next();
    });
}

////////////////////////////////////////
// TRIPS SUB-DOCUMENT CRUD OPERATIONS //
////////////////////////////////////////

// CREATE new 'Trips' sub-document
// requires:
//   - req.headers.authorization
//   - req.body.newUserTrip object MUST contain:
//     - trip_name
//     - waypoint_list
//     - optimized_route
//     - estimated_travel_distance
//     - estimated_travel_duration
router.post('/:userId/trips/', logger, (req, res) => {
    
    // code to check if request is valid
    console.log(req.body.newUserTrip);

    // check that newCuratedTrip object exists
    if(req.body.newUserTrip){

        const newUserTrip = req.body.newUserTrip
        
        // check that all required fields are present
        if( newUserTrip.trip_name &&
            newUserTrip.waypoint_list &&
            newUserTrip.optimized_route &&
            newUserTrip.estimated_travel_distance &&
            newUserTrip.estimated_travel_duration
        ){
            // create newUserTrip object from req.body data
            const newTripData = {
                trip_name: newUserTrip.trip_name,
                waypoint_list: newUserTrip.waypoint_list,
                optimized_route: newUserTrip.optimized_route,
                estimated_travel_distance: newUserTrip.estimated_travel_distance,
                estimated_travel_duration: newUserTrip.estimated_travel_duration,
                created: moment(),
                updated: moment(),    
            };
                    
            // create new 'CuratedTrips' document
            Users.findById(req.params.userId)
            .then(user => {
                user.trips.push(newTripData)
                return user.save();
            })
            .then(user => {    
                return res.status(200).json(user.trips);
            })
            .catch(error => {
                return res.status(500).json(error);
            });

        }else{
            
            // missing one of more key:value pairs in 'newUserTrip' object
            return res.status(406).json({msg: "The 'newUserTrip' object is missing one or more key:value pairs"});

        }
    }else{

        // missing 'newUserTrip' object
        return res.status(406).json({msg: "Trip create request requires a 'newUserTrip' object in request body"});
        
    }
});

// RETRIEVE single 'Trips' sub-document
// requires: req.headers.authorization 
router.get('/:userId/trips/:tripId', logger, (req, res) => {

    // code to check if request is valid

    // find requested 'Users' document
    Users.findById(req.params.userId)
    .then(user => {

        // find and return requested 'Trips' sub-document
        return res.status(200).json(user.trips.id(req.params.tripId));

    })
    .catch(error => {

        return res.status(500).json(error);

    });
});

// UPDATE single 'Trips' sub-document
// requires:
//   - req.headers.authorization 
//   - req.body.tripUpdateData MUST contain
//     - trip_name
//     - waypoint_list
//     - optimized_route
//     - estimated_travel_distance
//     - estimated_travel_duration
//     - created
router.put('/:userId/trips/:tripId', logger, (req, res) => {

    // code to check if request is valid
    if(req.body.tripUpdateData){

        let tripUpdateData = req.body.tripUpdateData;

        // check that all required fields are present
        if( tripUpdateData.trip_name && 
            tripUpdateData.waypoint_list && 
            tripUpdateData.optimized_route && 
            tripUpdateData.estimated_travel_distance && 
            tripUpdateData.estimated_travel_duration && 
            tripUpdateData.created
        ){
            // assemble update object 
            tripUpdateData.updated = moment();
        
            // find requested 'Users' document
            User.findById(req.params.userId)
            .then(user => {
        
                // find and update requested 'Trips' sub-document
                let tripToUpdate = user.trips.id(req.params.tripId);
                tripToUpdate.set(req.body.tripUpdateData);
                
                return user.save();
        
            })
            .then(updatedUser => {
        
                // return new version of 'Trips' sub-document
                return res.status(200).json(updatedUser.trips);
        
            })
            .catch(error => {
        
                return res.status(500).json(error);
        
            });

        }else{

            // missing one of more key:value pairs in 'tripUpdateData' object
            return res.status(406).json({msg: "The 'tripUpdateData' object is missing one or more key:value pairs"});

        }
    }else{

        // missing 'tripUpdateData' object
        return res.status(406).json({msg: "Trip update request requires a 'tripUpdateData' object in request body"});
        
    }
});

// DELETE single 'Trips' sub-document
// requires: req.headers['authorization'] 
router.delete('/:userId/trips/:tripId', logger, (req, res) => {

    // code to check if request is valid

    // find requested 'Users' document
    Users.findById(req.params.userId)
    .then(user => {

        // remove requested 'Trips' sub-document
        user.trips.id(req.params.tripId).remove();
        return user.save();
    })
    .then(updatedUser => {
        
        // return updated 'Trips' sub-document
        return res.status(200).json(updatedUser.trips)

    })
    .catch(error => {

        return res.status(500).json(error);

    });
        
});

// RETRIEVE all 'Trips' sub-documents
// requires: req.headers.authorization 
router.get('/:userId/trips', logger, (req, res) => {
    
    // code to check if request is valid

    // find requested 'Users' document
    Users.findbyId(req.params.userId)
    .then(user => {

        // return all 'Trips' sub-documents associated with requested 'Users' document
        return res.status(200).json(user.trips);

    })
    .catch(error => {

        return res.status(500).json(error);

    });

});

/////////////////////////////////////////////
// EXISTING USERS DOCUMENT CRUD OPERATIONS //
/////////////////////////////////////////////
    
// RETRIEVE single 'Users' document
// requires: req.headers.authorization 
router.get('/:userId', logger, (req, res) => {
    
    // find requested 'Users' document
    Users.findById(req.params.userId)
    .then( user => {

        // return requested 'Users' document omitting email and password
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            created: user.created,
            updated: user.updated,
            trips: user.trips,        
        });
    })
    .catch( error => {

        return res.status(500).json(error)

    });
});

// UPDATE single 'Users' document
// requires:
// - req.headers.authorization 
// - req.body.userUpdateData
router.put('/:userId', logger, (req, res) => {

    // check that 'userUpdateData' object exists
    if(req.body.userUpdateData){
        
        let userUpdateData = req.body.userUpdateData;

        // NEED TO ADD CASES TO HANDLE EMAIL & PASSWORD CHANGES
        // REQUIRES NEW PASSWORD HASH AND NEW TOKEN EMISSION

        // check that all required fields are present
        if( userUpdateData.name ){

            // set update time
            userUpdateData.updated = moment();

            // find requested 'Users' document and apply update
            Users.findOneAndUpdate(
                { _id: req.params.userId },
                userUpdateData,
            )
            .then(preUpdateUser => {
        
                // return pre-update 'Users' document omitting email and password
                return res.status(200).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    created: user.created,
                    updated: user.updated,
                    trips: user.trips,
                })
        
            })
            .catch(error => {
        
                return res.status(500).json(error);
        
            });
        }else{

            // missing one of more key:value pairs in 'userUpdateData' object
            return res.status(406).json({msg: "The 'userUpdateData' object is missing one or more key:value pairs"});           

        }
    }else{

        // missing 'userUpdateData' object
        return res.status(406).json({msg: "User update request requires a 'userUpdateData' object in request body"});        

    }
});

// DELETE single 'Users' document
// requires: req.headers.authorization 
router.delete('/:userId', logger, (req, res) => {
    
    // code to check if request is valid
    
    // find and delete requested 'Users' document
    Users.findOneAndRemove({ _id: req.params.userId })
    .then(removedUser => {

        // return deleted 'Users' document
        return res.status(200).json(removedUser);

    })
    .catch(error => {

      return res.status(500).json(error);

    });
});

module.exports = router;