// Server depedencies
const express   = require('express'),
      app       = express(),
      PORT      = 8080;
const bcrypt    = require('bcrypt');
const cors      = require('cors');
const jwt       = require('jsonwebtoken');
const mongoose  = require('mongoose');
const moment    = require('moment');
const path      = require('path');

// Import Evironmental Variables
const env = require('./.env');

// Import MongoDB models
const CuratedTrips  = require('../models/CuratedTrips');
const Users         = require('../models/Users');

// Define MongoDB Connection settings
const MONGO_CONNECTION_STRING = 'mongodb://localhost:27017/data/db';

// Middleware registration
app.use(express.static(path.join(__dirname, '/build')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Start MongoDB server
mongoose.connect(MONGO_CONNECTION_STRING);

const connection = mongoose.connection;

connection.on('open', () => { 
    console.log('We are connected to mongo ^_^');
    
    // start HTTP server
    app.listen(PORT, () => {
        console.log(`Server listening on Port ${PORT}\nUse Ctrl-C to exit`)
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

/*==================================
    EXTERNAL ROUTERS & ENDPOINTS
==================================*/

// Import External Routers
const mapsRouter = require('./routes/maps');
const privateRouter = require('./routes/private');

// Define external router
app.use('/maps', mapsRouter);
app.use('/private', privateRouter);


/*=====================================================
    CURATED TRIPS ROUTE ENDPOINTS & CRUD OPERATIONS
=====================================================*/

// CREATE new 'CuratedTrips' document
// - requires req.body.newCuratedTrip inlcuding
//   - trip_name: {type: String, required: true, unique: true},
//   - optimized_route: {type: Array, required: true},
//   - estimated_travel_distance: {type: Number, required: true},
//   - estimated_travel_duration: {type: Number, required: true},

app.post('/curated', (req, res) => {

    // code to check if request is valid

    // check that newCuratedTrip object exists
    if(req.body.newCuratedTrip){

        let newCuratedTrip = req.body.newCuratedTrip;

        // check that all required fields are present
        if( newCuratedTrip.trip_name &&
            newCuratedTrip.optimized_route &&
            newCuratedTrip.estimated_travel_distance &&
            newCuratedTrip.estimated_travel_duration
        ){
            // create new 'CuratedTrips' document
            CuratedTrips({ 
                trip_name: newCuratedTrip.trip_name,
                optimized_route: newCuratedTrip.optimized_route,
                estimated_travel_distance: newCuratedTrip.estimated_travel_distance,
                estimated_travel_duration: newCuratedTrip.estimated_travel_duration,
                vote_count: 0,
                save_count: 0,
                comments: [],
                created: moment(),
                updated: moment(),
            })
            .save()
            .then(newCuratedTrip => {
        
                // return new 'CuratedTrips' document
                return res.status(200).json(newCuratedTrip);
        
            })
            .catch(error => {
        
                return res.status(500).json(error);
        
            });

        }else{

            // missing one of more key:value pairs in 'newCuratedTrip' object
            return res.status(406).json({msg: "The 'newCuratedTrip' object is missing one or more key:value pairs"});

        }
    }else{

        // missing 'newCuratedTrip' object
        return res.status(406).json({msg: "Curated trip create request requires a 'newCuratedTrip' object in request body"});
        
    }
});

// RETRIEVE all 'CuratedTrips' documents
app.get('/curated', (req, res) => {

    // code to check if request is valid

    // find all 'CuratedTrips' documents
    CuratedTrips.find({})
    .then(allCuratedTrips => {

        // return all 'CuratedTrips' documents
        return res.status(200).json(allCuratedTrips);

    })
    .catch(error=>{

        return res.status(500).json(error);

    });
});

// UPDATE single 'CuratedTrips' document
// - requires req.body.tripUpdateData including
//   - trip_name: {type: String, required: true, unique: true},
//   - waypoint_list: {type: Array, required: true},
//   - optimized_route: {type: Array, required: true},
//   - estimated_travel_distance: {type: Number, required: true},
//   - estimated_travel_duration: {type: Number, required: true},
app.put('/curated/:tripId', (req, res)=>{

    // code to check if request is valid

    // check that tripUpdateData object exists
    if(req.body.tripUpdateData){
        
        // set updated time to now
        let tripUpdateData = req.body.tripUpdateData;
        tripUpdateData.updated = moment();
    
        // find requested 'CuratedTrips' document and update
        CuratedTrips.findOneAndUpdate(
            { _id: req.params.tripId },
            tripUpdateData
        )
        .then(preUpdateCuratedTrip=>{
    
            // returns previous version of object
            return res.status(200).json(preUpdateCuratedTrip);
    
        })
        .catch(error=>{
    
            return res.status(500).json(error);
    
        });   
    }else{

    }
});

// DELETE single 'CuratedTrips' document
app.delete('/curated/:tripId', (req, res) => {

    // code to check if request is valid

    // find requested 'CuratedTrips' document and delete
    CuratedTrips.findOneAndRemove({ _id: req.params.categoryId })
    .then(removedCuratedTrips => {

        // return deleted 'CuratedTrips' document
        return res.status(200).json(removedCuratedTrips);

    })
    .catch(error => {

        return res.status(500).json(error);

    });
});

/*=================================================
    AUTHENTICATION AND AUTHORIZATION ENDPPOINTS
=================================================*/

// REGISTER / CREATE new 'Users' document
// - requires req.body object including:
//   - email
//   - password
//   - name
app.post('/register', (req, res)=>{
        
    // continue only if email and password are provided
    if(req.body.email && req.body.password){
        
        // check if email is valid
        if(req.body.email){ // MODIFY TEST

            bcrypt.genSalt(12, (error, salt) => {

                if(error){

                    return res.status(500).json(error);

                }
    
                bcrypt.hash(req.body.password, salt, (error, hashedPassword) => {
    
                    if(error){

                        return res.status(500).json(error);

                    }

                    // create new 'Users' document
                    Users({
                        email: req.body.email,
                        password: hashedPassword,
                        name: req.body.name,
                        created: moment(),
                        updated: moment(),
                    })
                    .save()
                    .then(newUser => {

                        // return new 'Users' document
                        return res.status(200).json(newUser);

                    })
                    .catch(error => {

                        return res.status(500).json(error);

                    });
                });
            });

        }else{

            // invalid email
            return res.status(406).json({msg: 'Please enter a valid email'})

        }

    }else{
        
        // email or password missing
        return res.status(406).json({msg: 'Please enter a email and password'});
    }
});

// LOGIN / AUTHENTICATE & AUTHORIZE access to personal 'Users' document
// - requires req.body object including:
//   - email
//   - password
app.post('/login', (req, res)=>{

    if(req.body.email && req.body.password){

        // check if email is valid
        if(req.body.email){ // MODIFY TEST

            // find 'Users' document associated with email provided
            Users.findOne({email: req.body.email})
            .then(user => {
                console.log(user);
                // compare hashed user-provided password to hashed password on file
                bcrypt.compare(req.body.password, user.password, (error, match) => {
        
                    // something weird went wrong during compare operation
                    if(error){
    
                        return res.status(500).json(error);
    
                    }

                    // passwords match
                    if(match){
                        
                        // create payload using req data
                        // payload will remain valid for 1 hour
                        let payload = {
                            iss: 'www.lacroixonlocation.com',
                            sub: req.body.email,
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        };

                        // create json webtoken (valid for 1 hour from creation time)                       
                        let token = jwt.sign(payload, env.EPIC_ROADTRIPS_SECRET_KEY);

                        // build 'Users' object without password to return
                        let userData = {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            created: user.created,
                            updated: user.updated,
                            trips: user.trips,                
                        };
                        
                        // return webtoken created
                        // valid JWT required for all calls to private data
                        return res.status(200).json({
                            token: token,
                            userData: userData,
                        });
        
                    }else{
    
                        // passwords do not match
                        return res.status(401).json({msg: 'Dang! The email and password you provided do not match, please try again!'});

                    }
                });

            })
            .catch(error => {

                return res.status(500).json(error);

            });
        

        }else{

            // invalid email
            return res.status(406).json({msg: 'Please enter a valid email'})
            
        }

    }else{

        // email or password missing
        return res.status(406).json({msg: 'Please provide an email and a password'});

    }
});
