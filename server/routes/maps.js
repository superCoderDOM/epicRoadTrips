// Server depedencies
const express   = require('express'),
      router    = express.Router();
const moment    = require('moment');

// Import local variables
const env = require('../.env');
const roadtrip = require('../modules/roadtrip');

// Import Genetic Algorithm
// const optimalRoute = require('');

// Middleware registration
router.use(express.json());
router.use(express.urlencoded({extended:true}));

// Initialize Google Maps client
const googleMapsClient = require('@google/maps')
.createClient({
    key: env.GOOGLE_MAPS_API_KEY,
    Promise: Promise
});

/*================================
    GOOGLE MAPS API OPERATIONS
================================*/

// Call to Google Maps Directions API
// requires:
//   - req.body object MUST contain:
//     - mode --> travel mode: 'driving', 'bicycling', 'walking'
//     - epicRoadTrip --> array of waypoints
router.post('/directions', (req, res) => {

    let route;    

    // check if required body object is present
    if(req.body.epicRoadTrip && req.body.mode){

        route = req.body.epicRoadTrip;

    }else{ // FOR TESTING PURPOSE ONLY

        mode = 'driving';
        route = [
            'Acadia National Park, Maine, USA',
            '310 Mount Washington Hotel Rd, Bretton Woods, NH 03575, USA',
            '351 Farmington Ave, Hartford, CT 06105, USA',
            'N 6th St & Market St, Philadelphia, PA 19106, USA',
            '30 Market St, New Castle, DE 19720, USA',
            '100 State Cir, Annapolis, MD 21401, USA',
            'Mt Vernon, VA, USA',
            '1600 Pennsylvania Ave NW, Washington, DC 20500, USA',
            '2211 Woodward Ave, Detroit, MI 48201, USA',
            '4521 Spring Grove Ave, Cincinnati, OH 45232, USA',
            '8538 W Baden Ave, West Baden Springs, IN 47469, USA',
            'Lincoln Home National Historic Site Visitor Center, 426 S 7th St, Springfield, IL 62701, USA',
            'The Gateway Arch, St. Louis, MO 63102, USA',
            '320 S Esplanade St, Leavenworth, KS 66048, USA',
            '2300 Grand Ave, Des Moines, IA 50312, USA',
            '200 Tower Ave, St Paul, MN 55111, USA',
            'Ashfall Fossil Beds State Historical Park, 86930 517th Ave, Royal, NE 68773, USA',
            'Craters of the Moon National Monument & Preserve, Idaho, USA',
            '1201 Mason St, San Francisco, CA 94108, USA',
            'San Andreas Fault, California, USA',
            'Nevada 89005, USA',
            'Grand Canyon National Park, Arizona, USA',
            'Bryce Canyon National Park, Utah, USA',
            'Pikes Peak, Colorado 80809, USA',
            '300 Alamo Plaza, San Antonio, TX 78205, USA',
            'Chickasaw National Recreation Area, 901 W 1st St, Sulphur, OK 73086, USA',
            'Toltec Mounds Archeological State Park, 490 Toltec Mounds Rd, Scott, AR 72142, USA',
            'Graceland, Elvis Presley Blvd, Memphis, TN 38116, USA',
            'Vicksburg National Military Park, 3201 Clay St, Vicksburg, MS 39183, USA',
            'French Quarter, New Orleans, LA, USA',
            'USS Alabama, 2703 Battleship Pkwy, Mobile, AL 36603, USA',
            'Cape Canaveral, FL 32920, USA',
            'Okefenokee Swamp Park, 5700 Okefenokee Swamp Park Rd, Waycross, GA 31503, USA',
            '1000 N croatan hwy, Kill Devil Hills, NC 27948, USA',
            '200 Congress Pl, Cape May, NJ 08204, USA',
            'Statue of Liberty National Monument, New York, NY 10004, USA',
            '44 Ochre Point Ave, Newport, RI 02840, USA',
            'Building 22, Charlestown Navy Yard, Charlestown, MA 02129, USA'
        ];
    }

    // Make roudtrip by coming back to start (trip already optimized for this scenario)
    route.push(route[0]);
    
    // Limit imposed Google Maps Directions API on number of waypoints
    let batchSize = 10;
    
    // Break road trip into batches
    let subset = 0;
    let googlePromises = [];
    while (subset < route.length){
        let waypointSubset = route.slice(subset, subset + batchSize);
        const startPoint = waypointSubset[0];
        const midPoints = waypointSubset.slice(1, waypointSubset.length - 1);
        const endPoint = waypointSubset[waypointSubset.length - 1];
        googlePromises.push(
            newGooglePromise = googleMapsClient.directions({
                origin: startPoint,
                destination: endPoint,
                waypoints: midPoints,
                mode: mode,
                language: 'en',
                units: 'metric',
            })
            .asPromise()
        );
        subset += batchSize - 1;
    }

    Promise.all(googlePromises)
    .then(routes => {

        let epicSegments = []
        for (let i = 0; i < routes.length; i++){
            epicSegments.push(routes[i].json);
        }

        // return res.status(200).json(routes);
        return res.status(200).json(epicSegments);

    })
    .catch(error => {

        return res.status(500).json(error);
    
    });
});

// Call to Google Maps Distance Matrix API
// requires:
//   - req.body object MUST contain:
//     - mode --> travel mode: 'driving', 'bicycling', 'walking'
//     - waypoints --> array of waypoints
router.post('/findroute', (req, res) => {

    console.log(req.body);

    let mode, allWaypoints;
    
    if(req.body.mode && req.body.waypoints){
        mode = req.body.mode;
        allWaypoints = req.body.waypoints;
    }else{
        mode = 'driving';
        allWaypoints =  [
            "USS Alabama, Battleship Parkway, Mobile, AL",
            "Grand Canyon National Park, Arizona",
            "Toltec Mounds, Scott, AR",
            "San Andreas Fault, San Benito County, CA",
            "Cable Car Museum, 94108, 1201 Mason St, San Francisco, CA 94108",
            "Pikes Peak, Colorado",
            "The Mark Twain House & Museum, Farmington Avenue, Hartford, CT",
            "New Castle Historic District, Delaware",
            "White House, Pennsylvania Avenue Northwest, Washington, DC",
            "Cape Canaveral, FL",
            "Okefenokee Swamp Park, Okefenokee Swamp Park Road, Waycross, GA",
            "Craters of the Moon National Monument & Preserve, Arco, ID",
            "Lincoln Home National Historic Site Visitor Center, 426 South 7th Street, Springfield, IL",
            "West Baden Springs Hotel, West Baden Avenue, West Baden Springs, IN",
            "Terrace Hill, Grand Avenue, Des Moines, IA",
            "C. W. Parker Carousel Museum, South Esplanade Street, Leavenworth, KS",
            "French Quarter, New Orleans, LA",
            "Acadia National Park, Maine",
            "Maryland State House, 100 State Cir, Annapolis, MD 21401",
            "USS Constitution, Boston, MA",
            "Olympia Entertainment, Woodward Avenue, Detroit, MI",
            "Fort Snelling, Tower Avenue, Saint Paul, MN",
            "Vicksburg National Military Park, Clay Street, Vicksburg, MS",
            "Gateway Arch, Washington Avenue, St Louis, MO",
            "Ashfall Fossil Bed, Royal, NE",
            "Hoover Dam, NV",
            "Omni Mount Washington Resort, Mount Washington Hotel Road, Bretton Woods, NH",
            "Congress Hall, Congress Place, Cape May, NJ 08204",
            "Statue of Liberty, Liberty Island, NYC, NY",
            "Wright Brothers National Memorial Visitor Center, Manteo, NC",
            "Spring Grove Cemetery, Spring Grove Avenue, Cincinnati, OH",
            "Liberty Bell, 6th Street, Philadelphia, PA",
            "The Breakers, Ochre Point Avenue, Newport, RI",
            "Graceland, Elvis Presley Boulevard, Memphis, TN",
            "The Alamo, Alamo Plaza, San Antonio, TX",
            "Bryce Canyon National Park, Hwy 63, Bryce, UT",
        ];
    }

    // Call optimalRoute as server would do
    roadtrip.optimalRoute(allWaypoints, mode)
    .then(epicRoadTrip => {
        console.log("Epic Road Trip:", epicRoadTrip);
        roadtrip.writeEpicRoadTrip(epicRoadTrip);
        return res.status(200).json(epicRoadTrip);
    })
    .catch(error => {
        return res.status(500).json(error);
    });
});

// Call to Google Maps Directions API
router.get('/places/lodging', (req, res) => {

    return res.status(200).json({msg: 'Lodging endpoint'})

});

// Call to Google Maps Places Photo API
router.get('/places/photos', (req, res) => {

    // Fetch a photo associated with place
    googleMapsClient.placesPhoto({
        photoreference: req.body.photoreference,
        // photoreference: place.photos.photo_reference,
        maxwidth: 400,
        maxheight: 400
    })
    .asPromise()
    .then(response => {
        return res.status(200).json({msg: 'Photos endpoint'});
    })
    .catch(error => {
        return res.status(500).json(error);
    });
});

// Call to Google Maps Places API
// requires:
//   - req.query object MUST contain:
//     - keywords --> url encoded list of search words
router.get('/places', (req, res) => {
    // console.log('/places hit');
    // Find a place by keywords
    googleMapsClient.places({
        query: req.query.keywords,
        language: 'en',
        // query: 'fast food',
        // location: [-33.865, 151.038],
        // radius: 5000,
        // minprice: 1,
        // maxprice: 4,
        // opennow: true,
        // type: 'restaurant'
    })
    .asPromise()
    .then(response => {
        return res.status(200).json(response.json.results);
    })
    .catch(error => {
        return res.status(500).json(error);
    });
});
    
module.exports = router;