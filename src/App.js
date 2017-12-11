// npm packages
import React from 'react';
import axios from 'axios';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// local css
import './App.css';

// API keys
// import keys from './keys';

// components
import Home from './components/Home';
import NavBar from './components/NavBar';
import LoginForm from './components/FormLogIn'
import TripBuilder from './components/TripBuilder';
import TripDetails from './components/TripDetails';
import TripForm from './components/FormTripInfo'
import TripList from './components/TripList';
// import MapDisplay from './components/MapDisplay';

// TEST DATA
import testData from './tests/mockStateData';
const mockCuratedTrips = testData.mockCuratedTrips;
// const mockWaypointList = testData.mockWaypointList;

class App extends React.Component{

    constructor(){
        super();

        this.state = {
            jwt: '',
            userData: {}, // user document saved in database minus password
            newTrip: false,
            newUser: true,
            waypointList: [],
            travelMode: 'driving',
            searchResults: [],
            epicRoadTrip: {},
            curatedTrips: mockCuratedTrips,
            mapLoading: false,
            showLoginForm: false,
            showTripForm: false,
        };

        // bindings
        this.addCuratedToUserTrips = this.addCuratedToUserTrips.bind(this);
        this.addNewTripToUserTrips = this.addNewTripToUserTrips.bind(this);
        this.addUserToCuratedTrips = this.addWaypoint.bind(this);
        this.addWaypoint = this.addWaypoint.bind(this);
        this.createNewUser = this.createNewUser.bind(this);
        this.closeLoginForm = this.closeLoginForm.bind(this);
        this.closeTripForm = this.closeTripForm.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.deleteUserTrip = this.deleteUserTrip.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
        this.fetchUserData = this.fetchUserData.bind(this);
        this.findOptimalRoute = this.findOptimalRoute.bind(this);
        this.getAllCuratedTrips = this.getAllCuratedTrips.bind(this);
        this.logUserIn = this.logUserIn.bind(this);
        this.logUserOut = this.logUserOut.bind(this);
        this.openRoadTripFormEdit = this.openRoadTripFormEdit.bind(this);
        this.openRoadTripFormNew = this.openRoadTripFormNew.bind(this);
        this.removeWaypoint = this.removeWaypoint.bind(this);
        this.requestLogin = this.requestLogin.bind(this);
        this.requestRegistration = this.requestRegistration.bind(this);
        this.resetStopOvers = this.resetStopOvers.bind(this);
        this.searchGoogleMapsPlaces = this.searchGoogleMapsPlaces.bind(this);
        this.secondsToString = this.secondsToString.bind(this);
        this.setPage = this.setPage.bind(this);
    }

    /*==================================
        PRIVATE|USER CRUD OPERATIONS
    ==================================*/
    
    // CREATE - Add new user to database
    createNewUser(event){
        
        // prevent page reload
        event.preventDefault();
        
        // checks to make sure input data is valid

        // create new user
        let newUser = {
            email: event.target.userEmail.value,
            password: event.target.userPassword.value,
            name: event.target.userName.value,
            // created: --> POPULATED SERVER-SIDE <--
            // updated: --> POPULATED SERVER-SIDE <--
            // trips: --> POPULATED SERVER-SIDE <--
        }

        // add new User to database
        axios.post(`/register`, newUser)
        .then(newUserWithID => {
            this.setState({
                userData: newUserWithID.data,
                newUser: false,
                showLoginForm: false,
            });
        })
        .catch(error => {
            this.errorHandler(error);
        });
    }
    
    // RETRIEVE | AUTHENTICATE & AUTHORIZE - Log in existing user and retrieve data
    logUserIn(event){

        // prevent page reload
        event.preventDefault();
        
        // checks to make sure input data is valid

        // create new User object
        let userCredentials = {
            email: event.target.userEmail.value,
            password: event.target.userPassword.value,
        }

        // authorize User to access personal data
        axios.post(`/login`, userCredentials)
        .then(response => {
            this.setState({
                jwt: response.data.token,
                userData: response.data.userData,
                newUser: false,
                showLoginForm: false,
            });
            localStorage.setItem('epicToken', JSON.stringify(response.data.token));        
        })
        .catch(error => {
            this.errorHandler(error);
        });
        event.target.userEmail.value = "";
        event.target.userPassword.value = "";
    }

    fetchUserData(){

        // make local copy of user data
        let user = this.state.userData;        

        // fetch User document from database
        axios.get(`/private/${ user._id }`, 
        { headers: { authorization: this.state.jwt } })
        .then(reqUser => {
            this.setState({
                userData: reqUser.data,
                newUser: false,
                showLoginForm: false,
            });
        })
        .catch(error => {
            this.errorHandler(error);
        });    
    }

    // ↓↓↓↓ UPDATE|DELETE OPERATIONS FOR AUTHORIZED USERS ONLY ↓↓↓↓

    // UPDATE - Make changes to User document
    updateUser(event){

        // prevent page reload
        event.preventDefault();

        // checks to make sure input data is valid

        // create User update object
        let userUpdateData = {
            email: event.target.userEmail.value,
            password: event.target.userPassword.value,
            name: event.target.userName.value,
            // trips: --> POPULATED SERVER-SIDE <--
            // created: --> POPULATED SERVER-SIDE <--
            // updated: --> POPULATED SERVER-SIDE <--
        }

        // add new User to database
        axios.put(`/register`, userUpdateData)
        .then(updatedUser => {
            this.setState({
                userData: updatedUser.data,
            });
        })
        .catch(error => {
            this.errorHandler(error);
        });
    }

    // DELETE - Remove user from database
    deleteUser(){

        // make deep clone copy of user data
        let user = JSON.parse(JSON.stringify(this.state.userData));
        
        // delete User document from database
        axios.delete(`/private/${ user._id }`, 
            { headers: { authorization: this.state.jwt } })
        .then(deletedUser => {

            // update state
            this.setState({
                jwt: '',
                userData: {},
            });
            console.log(deletedUser.data);
        })
        .catch(error => {
            this.errorHandler(error);
        })
    }

    // DELETE - Log User out by deleting data locally
    logUserOut(){
        this.setState({
            jwt: '',
            userData: {},
            waypointList: [],
            travelMode: 'driving',
            searchResults: [],
            epicRoadTrip: {},
        });
        localStorage.epicData = '';
        localStorage.epicToken = '';
    }

    /*=======================================
        PRIVATE|USER TRIP CRUD OPERATIONS
    =======================================*/

    // CREATE - Add Curated Trip as NEW User Trip document
    addCuratedToUserTrips(tripID){

        // make deep clone copy of user data
        let user = JSON.parse(JSON.stringify(this.state.userData));
        
        // find required Curated Trip
        let reqCuratedTrip = this.state.curatedTrips.find(trip=>trip._id === tripID);

        // create new user trip entry
        let newUserTrip = {
            trip_name: reqCuratedTrip.trip_name,
            waypoint_list: reqCuratedTrip.optimized_route,
            optimized_route: reqCuratedTrip.optimized_route,
            estimated_travel_distance: reqCuratedTrip.estimated_travel_distance,
            estimated_travel_duration: reqCuratedTrip.estimated_travel_duration,
            image_url: reqCuratedTrip.image_url,            
            // created: --> POPULATED SERVER-SIDE <--
            // updated: --> POPULATED SERVER-SIDE <--
        };

        // update database
        axios.post(`/private/${ user._id }/trips`,
            { newUserTrip: newUserTrip },
            { headers: { authorization: this.state.jwt } })
        .then(userTripsWithNewTripID => {
            
            // add new trip object to User Trip list
            user.trips = userTripsWithNewTripID; 

            // update state
            this.setState({
                userData: user,
            });
        })
        .catch(error => {
            this.errorHandler(error);
        });
    }

    // CREATE - Add NEW Epic Road Trip to User document
    addNewTripToUserTrips(event){

        // prevent page reload
        event.preventDefault();
        
        // make deep clone copy of user data
        let user = JSON.parse(JSON.stringify(this.state.userData));

        // create new User Trip entry
        let newUserTrip = {
            trip_name: event.target.trip_name.value,
            waypoint_list: this.state.searchResults.map(waypoint => `place_id:${ waypoint.place_id }`),
            optimized_route: this.state.epicRoadTrip.testRoadTrip,
            estimated_travel_distance: this.state.epicRoadTrip.totalTripDistance,
            estimated_travel_duration: this.state.epicRoadTrip.totalTripDuration,
            // created: --> POPULATED SERVER-SIDE <--
            // updated: --> POPULATED SERVER-SIDE <--
        };

        // update database
        axios.post(`/private/${ user._id }/trips`, 
            { newUserTrip: newUserTrip }, 
            { headers: { authorization: this.state.jwt } })
        .then(userTripsWithNewTripID => {

            // add new trip object to User Trip list
            user.trips = userTripsWithNewTripID.data; 

            // update state
            this.setState({
                userData: user,
                showTripForm: false,
            });
        })
        .catch(error => {
            this.errorHandler(error);
        });
    }
    
    // UPDATE - Make changes to existing User Trip document
    updateUserTrip(event, tripID){

        // prevent page reload
        event.preventDefault();

        // make deep clone copy of user data
        let user = JSON.parse(JSON.stringify(this.state.userData));
        let reqUserTrip = user.trips.find(trip=>trip._id === tripID);
        
        // create update User Trip object
        let updatedUserTrip = {
            trip_name: event.target.trip_name.value,
            waypoint_list: event.target.waypoint_list.value,
            optimized_route: event.target.optimized_route.value,
            estimated_travel_distance: event.target.estimated_travel_distance.value,
            estimated_travel_duration: event.target.estimated_travel_duration.value,
            image_url: event.target.image_url,
            created: reqUserTrip.created
            // updated: --> POPULATED SERVER-SIDE <--
        };

        // update database
        axios.put(`/private/${ user._id }/trips/${ tripID }`,
            { tripUpdateData: updatedUserTrip }, 
            { headers: { authorization: this.state.jwt } })
        .then(updatedTrip => {

            // update User Trip list
            user.trips = updatedTrip.data; 
            
            // update state
            this.setState({
                userData: user,
            });
        })
        .catch(error => {
            this.errorHandler(error);
        });
        
    }

    // DELETE - Remove User Trip from database
    deleteUserTrip(tripID){

        // make deep clone copy of user data
        let user = JSON.parse(JSON.stringify(this.state.userData));
        
        axios.delete(`/private/${ user._id }/trips/${ tripID }`,
            { headers: { authorization: this.state.jwt } })
        .then(deletedTrip => {

            // remove trip object from User Trip list
            user.trips = this.state.userData.trips.filter(trip => trip._id !== tripID);

            // update state
            this.setState({
                userData: user,
            })
        })
        .catch(error => {
            this.errorHandler(error);
        });
    }

    /*===================================
        CURATED TRIPS CRUD OPERATIONS
    ===================================*/

    // CREATE - Add User-generated trip as NEW Curated Trip document
    addUserToCuratedTrips(tripID){
        
        // make local copy of user data
        let user = this.state.userData;

        // find required User Trip
        let reqUserTrip = user.trips.find(trip=>trip._id === tripID);

        // create new user trip entry
        let newCuratedTrip = {
            trip_name: reqUserTrip.trip_name,
            waypoint_list: reqUserTrip.optimized_route,
            optimized_route: reqUserTrip.optimized_route,
            estimated_travel_distance: reqUserTrip.estimated_travel_distance,
            estimated_travel_duration: reqUserTrip.estimated_travel_distance,
            image_url: reqUserTrip.image_url,
            // vote_count: --> POPULATED SERVER-SIDE <--
            // save_count: --> POPULATED SERVER-SIDE <--
            // comments: --> POPULATED SERVER-SIDE <--
            // created: --> POPULATED SERVER-SIDE <--
            // updated: --> POPULATED SERVER-SIDE <--
        };

        // update database
        axios.post(`/curated/`, { newCuratedTrip: newCuratedTrip })
        .then(newCuratedTripWithID => {

            // update state
            this.setState({
                curatedTrips: [...this.state.curatedTrips, newCuratedTripWithID.data],
            });
        })
        .catch(error => {
            this.errorHandler(error);
        });
    }

    // RETRIEVE - Fetch all Curated Trips
    getAllCuratedTrips(){
        // get all Curated Trips documents from database
        axios.get(`/curated`)
        .then(allCuratedTrips => {
            this.setState({
                curatedTrips: allCuratedTrips.data,
            });
        })
        .catch(error => {
            this.errorHandler(error);
        });
    }

    // ↓↓↓↓ UPDATE|DELETE OPERATIONS ↓↓↓↓
    // Available to administrators/superusers ONLY

    /*======================================================
        GOOGLE MAPS REQUESTS AND EPIC ROAD TRIP CREATION
    ======================================================*/

    // Find optimal route connecting waypoints
    findOptimalRoute(event){

        // prevent page reload
        event.preventDefault();
        
        // build request body object
        let tripInfo = {
            // travel mode is set to driving by default
            mode: this.state.travelMode? this.state.travelMode : 'driving',
            waypoints: this.state.searchResults.map(waypoint => {
                return `place_id:${ waypoint.place_id }`;
            }),
        };

        // console.log(tripInfo);

        this.setState({
            mapLoading: true,
        });
        
        axios.post(`/maps/findroute`, tripInfo, {timeout: 600000,}) // wait up to 5 minutes for response
        .then(response=>{
            console.log(response.data);
            // Save Epic Road Trip data to state
            this.setState({
                epicRoadTrip: response.data,
                mapLoading: false,
            });
            localStorage.epicData.epicRoadTrip = JSON.stringify(response.data);            
            localStorage.epicData.searchResults = JSON.stringify(this.state.searchResults);
            localStorage.epicData.waypointList = JSON.stringify(this.state.waypointList);
        })
        .catch(error=>{
            this.errorHandler(error);
            this.setState({
                mapLoading: false,
            });    
        });
    }

    // Look up places using user-input keywords
    searchGoogleMapsPlaces(event){

        // prevent page reload
        event.preventDefault();

        const keywords = event.target.keywords.value;
        const searchKeywords = keywords.split(" ").join("+");


        // Make a request for a user with a given ID
        axios.get(`/maps/places?keywords=${ searchKeywords }`)        
        .then(response => {

            let waypointName;
            if(response.data[0].formatted_address > response.data[0].name){
                waypointName = response.data[0].formatted_address;
            }else{
                waypointName = response.data[0].name;                
            }

            this.setState({
                searchResults: [...(new Set([...this.state.searchResults, response.data[0]]))],
                waypointList: [...(new Set([...this.state.waypointList, waypointName]))],
            });

            // Update local storage
            const epicData = {
                epicRoadTrip: this.state.epicRoadTrip,
                searchResults: this.state.searchResults,
                waypointList: this.state.waypointList,
            };
            localStorage.setItem('epicData', JSON.stringify(epicData));
    
        })
        .catch(error => {
            this.errorHandler(error);
        });

        event.target.keywords.value = "";
    }

    /*================================================
        RESPONSIVE LOCAL DATA AND STATE MANAGEMENT
    ================================================*/

    // Add new waypoint to current list
    addWaypoint(event){
        this.setState({
            waypointList: [...event.target.origin.value, event.target.waypoints.value],
        });
        
        localStorage.epicData.waypointList = JSON.stringify(this.state.waypointList);
        localStorage.epicData.searchResults = JSON.stringify(this.state.searchResults);
    }

    closeLoginForm(){
        this.setState({
            showLoginForm: false,
        });
    }

    closeTripForm(){
        this.setState({
            showTripForm: false,
        });
    }

    // Lifecycle method, scripts will run before page renders
    componentWillMount(){

        // fetch Trip Builder data if present
        const epicData = JSON.parse(localStorage.getItem('epicData'));
    
        // fetch token from local storage if present
        const epicToken = JSON.parse(localStorage.getItem('epicToken'));
        
        // update local state accordingly
        if (epicData && epicToken){
            this.setState({
                jwt: epicToken,
                epicRoadTrip: epicData.epicRoadTrip,
                searchResults: epicData.searchResults,    
                waypointList: epicData.waypointList,
            });
            this.fetchUserData();            
        }else if (epicData){
            this.setState({
                epicRoadTrip: epicData.epicRoadTrip,
                searchResults: epicData.searchResults,    
                waypointList: epicData.waypointList,
            });
        } else if (epicToken){
            // this.getAllCuratedTrips();
            this.setState({
                jwt: epicToken,
            });
            this.fetchUserData();
        }
    }

    // Save data locally when component unmounts
    componentWillUnmout(){

        // build epicData object
        const epicData = {
            epicRoadTrip: this.state.epicRoadTrip,
            searchResults: this.state.searchResults,
            waypointList: this.state.waypointList,
        };

        // save current Trip Builder progress to local memory
        localStorage.setItem('epicData', JSON.stringify(epicData));

        // save current session token to local storage
        localStorage.setItem('epicToken', JSON.stringify(this.state.jwt));        
    }

    // Handle errors
    errorHandler(error){
        console.log(error);
    }

    // Open road trip form in edit existing trip mode
    openRoadTripFormEdit(){
        this.setState({
            newTrip: false,
            showTripForm: true,
        });
    }
    
    // Open road trip form in new entry mode
    openRoadTripFormNew(){
        this.setState({
            newTrip: true,
            showTripForm: true,
        });
    }

    // Remove waypoint from current list
    removeWaypoint(value){
        this.setState({
            searchResults: [... this.state.searchResults.filter(item => item.formatted_address !== value && item.name !== value)],
            waypointList: [...this.state.waypointList.filter(waypoint => waypoint !== value)],
        });
    }

    // Open user login form in login mode
    requestLogin(){
        this.setState({
            newUser: false,
            showLoginForm: true,
        });
    }

    // Open user login form in registration mode
    requestRegistration(){
        this.setState({
            newUser: true,
            showLoginForm: true,
        });
    }

    // Reset Trip Builder lists of waypoints and search results
    resetStopOvers(){
        this.setState({
            searchResults: [],
            waypointList: [],
        });

        // Update local storage
        const epicData = {
            waypointList: [],
            searchResults: [],
        };
        localStorage.setItem('epicData', JSON.stringify(epicData));
    }

    // Transforms time sotred in seconds to days/hours/minutes/seconds
    secondsToString(seconds){
        const numDays = Math.floor(seconds / 86400);
        const numHours = Math.ceil((seconds % 86400) / 3600);
        // const numHours = Math.floor((seconds % 86400) / 3600);
        // const numMinutes = Math.floor(((seconds % 86400) % 3600) / 60);
        // const numSeconds = ((seconds % 86400) % 3600) % 60;
        return numDays + (numDays > 1 ? " days " : numDays === 1 ? " day " : "") + numHours + " hours "; // + numMinutes + " minutes " + numSeconds + " seconds";
    }

    // Set page
    setPage(currentPage){
        this.setState({
            page: currentPage,
        });
    }

    render(){

        return(
            <div>
                <Helmet>
                    {/* <script src={`https://maps.googleapis.com/maps/api/js?key=${ googleMapsAPIKey }&v=3.exp&libraries=geometry,drawing,places`}></script> */}
                </Helmet>
                <NavBar 
                    logUserOut={ this.logUserOut }
                    numUserTrips={ this.state.userData.trips ? this.state.userData.trips.length : 0 }
                    requestRegistration={ this.requestRegistration }
                    requestLogin={ this.requestLogin }
                    userName={ this.state.userData.name }
                />
                {this.state.showLoginForm? 
                    <LoginForm
                        closeLoginForm={ this.closeLoginForm }
                        newUser={ this.state.newUser }
                        submitHandler = { this.state.newUser? this.createNewUser : this.logUserIn }
                    /> : "" 
                }
                {this.state.showTripForm?
                    <TripForm
                        closeTripForm={ this.closeTripForm }
                        epicRoadTrip={ this.state.epicRoadTrip }
                        newTrip={ this.state.newTrip }
                        secondsToString={ this.secondsToString } 
                        submitHandler={ this.state.newTrip? this.addNewTripToUserTrips : this.updateUserTrip }
                        waypointList={ this.state.waypointList }
                    /> : ""
                }
                <Switch>
                    <Route exact path={"/"} render={ (props) => 
                        <Home 
                            match={ props.match } 
                            title={"Curated Road Trips"} 
                            trips={ this.state.curatedTrips } 
                            addToList={ this.addCuratedToUserTrips } 
                            secondsToString={ this.secondsToString }
                        /> } 
                    />
                    <div className="container-fluid">
                        <section>
                            <Route exact path={"/tripbuilder"} render={ (props) =>
                                <TripBuilder 
                                    match={ props.match }
                                    epicRoadTrip={ this.state.epicRoadTrip }
                                    findOptimalRoute={ this.findOptimalRoute } 
                                    mapLoading={ this.state.mapLoading }
                                    openRoadTripFormNew={ this.openRoadTripFormNew }
                                    removeWaypoint={ this.removeWaypoint }
                                    resetStopOvers={ this.resetStopOvers }
                                    searchResults={ this.state.searchResults }
                                    secondsToString={ this.secondsToString } 
                                    submitHandler={ this.searchGoogleMapsPlaces } 
                                    waypointList={ this.state.waypointList } 
                                /> }
                            />
                            <Route exact path={"/curated/trips"} render={ (props) => 
                                <TripList 
                                    match={ props.match } 
                                    title={"Curated Road Trips"} 
                                    trips={ this.state.curatedTrips } 
                                    addToList={ this.addCuratedToUserTrips } 
                                    secondsToString={ this.secondsToString } 
                                /> } 
                            />
                            <Route path={"/curated/trips/:tripId"} render={ (props) => 
                                <TripDetails 
                                    match={ props.match } 
                                    trip={ this.state.curatedTrips.concat(this.state.userData.trips).find(item=>props.match.params.tripId === item._id) } 
                                    addToList={ this.addCuratedToUserTrips } 
                                    secondsToString={ this.secondsToString } 
                                /> } 
                            />
                            <Route exact path={"/private/trips"} render={ (props) => 
                                <TripList 
                                    match={ props.match } 
                                    title={"Your Road Trip Collection"} 
                                    trips={ this.state.userData.trips } 
                                    addToList={ this.addUserToCuratedTrips } 
                                    secondsToString={ this.secondsToString } 
                                /> } 
                            />
                            <Route path={"/private/trips/:tripId"} render={ (props) => 
                                <TripDetails 
                                    match={ props.match } 
                                    trip={ this.state.userData.trips.concat(this.state.userData.trips).find(item=>props.match.params.tripId === item._id) } 
                                    addToList={ this.addUserToCuratedTrips } 
                                    removeFromList={ this.deleteUserTrip } 
                                    secondsToString={ this.secondsToString } 
                                /> }
                            />
                            {/* <Route exact path={"/about"} render={ (props) => 
                                <MapDisplay 
                                    searchResults={ this.state.searchResults } 
                                    travelMode={ this.state.travelMode } 
                                    epicRoadTrip={ this.epicRoadTrip }
                                    errorHandler={ this.errorHandler }
                                /> } 
                            />  */}
                        </section>
                    </div>
                </Switch>
                <footer>
                </footer>
            </div>
        );
    }
}

export default App;