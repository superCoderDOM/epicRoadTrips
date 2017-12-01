import React from 'react';
import Helmet from 'react-helmet';
import customMapStyles from "./retroMapStyles.json";
import keys from '../keys';

/* global google */
const google = window.google;

class MapDisplay extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            epicRoadTrip: this.props.epicRoadTrip,
            searchResults: this.props.searchResults,
            travelMode: this.props.travelMode,            
        };

        // bindings
        this.createRoutes = this.createRoutes.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUpdate = this.componentWillUpdate.bind(this);
    }
            
    // Break optimized road trip into smaller batches for display using Google Maps Directions API
    createRoutes(route){

        // Google Maps API is limited to 10 waypoints so need to break into batches
        const batchSize = 10;

        // create roundtrip by adding first waypoint to end of list (route is optimized for this)
        route.push(route[0]);

        // create road trip segments
        let subset = 0;
        let tripSegments = [];
        while (subset < route.length){
            let waypointSubset = route.slice(subset, subset + batchSize);
            let startPoint = waypointSubset[0];
            let midPoints = waypointSubset.slice(1, waypointSubset.length - 1);
            let endPoint = waypointSubset[waypointSubset.length - 1];
            tripSegments.push({
                startPoint: startPoint, 
                endPoint: endPoint, 
                midPoints: midPoints,
            });
            subset += batchSize - 1;
        }

        // set up required information to render results on map 
        const markerOptions = {
            icon: "http://maps.gstatic.com/mapfiles/markers2/marker.png",
        };
        const directionsDisplayOptions = {
            preserveViewport: true,
            markerOptions: markerOptions,
        };

        // initialize Google services
        const directionsService = new google.maps.DirectionsService();
        const directionsDisplay = new google.maps.DirectionsRenderer(directionsDisplayOptions);

        // Generate route segments for rendering optimized road trip on map
        let epicRoadTripSegments = [];
        for (let i = 0; i < tripSegments.length; i++){

            let waypoints = [];
            for (let j = 0; j < tripSegments[i].midPoints.length; j++) {
                waypoints.push({
                    location: tripSegments[i].midPoints[j],
                    stopover: true,
                });
            }
            
            let request = {
                origin: tripSegments[i].startPoint,
                destination: tripSegments[i].endPoint,
                waypoints: waypoints,
                optimizeWaypoints: false,
                travelMode: this.state.travelMode,
            };

            directionsService.route(request, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);    
                }
            });

            epicRoadTripSegments.push(directionsDisplay);
        }
        this.setState({epicRoadTripSegments});
    }   

    componentWillUpdate(){
        if(this.state.searchResults){

            if(this.state.epicRoadTrip){

                this.createRoutes(this.state.epicRoadTrip)
                .then(epicRoadTripSegments => {

                    for (let i = 0; i < epicRoadTripSegments.length; i++){
                        epicRoadTripSegments[i].setMap(this.map);
                    }
                })
                .catch(error => {
                    this.props.errorHandler(error);
                });
            }else{
                let markers = [];
                for (let i = 0; i < this.state.searchResults.length; i++){
                    markers.push(new google.maps.Marker({
                        // position: searchResults.,
                        map: this.map,
                    }));
              
                    markers[i].setMap(this.map);
                }   
            }
        }
    }

    componentDidMount(){

        this.map = new google.maps.Map(this.refs.map, { 
            center: new google.maps.LatLng(43.653226, -79.383184), // Toronto
            zoom: 5,
        });

        // google.maps.event.addDomListener(window, 'load', initialize);
    }

    render(){
        return(
            <div>
                <Helmet />
                    <script src={`https://maps.googleapis.com/maps/api/js?key=${ keys.GOOGLE_MAPS_API_KEY }&v=3.exp&libraries=geometry,drawing,places`}></script>
                <Helmet />
                <div ref="map" id="map-canvas" style={ customMapStyles } ></div>
            </div>
        );
    }
}

export default MapDisplay;