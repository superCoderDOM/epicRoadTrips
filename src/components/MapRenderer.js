import React from 'react';
import keys from '../keys';

/* global google */
const GOOGLE_MAPS_API_KEY = keys.GOOGLE_MAPS_API_KEY;
// const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const { withScriptjs, withGoogleMap,GoogleMap, Marker, DirectionsRenderer } = require("react-google-maps");
// const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `80vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),

  lifecycle({

    componentDidUpdate(prevProps, prevState){
      if (prevProps !== this.props){
        
        // render Epic Road Trip if defined
        // if (this.props.epicRoadTrip.length > 0){

        //   const DirectionsService = new google.maps.DirectionsService();

        //   let directions = [];
        //   for (let i = 1; i < this.props.epicRoadTrip; i++){
        //     DirectionsService.route({
        //       origin: this.props.epicRoadTrip.testRoadTrip[i - 1],
        //       destination: this.props.epicRoadTrip.testRoadTrip[i],
        //       travelMode: this.props.travelMode,
        //     }, (result, status) => {

        //       if (status === google.maps.DirectionsStatus.OK) {
        //         directions.push(result);
        //         console.log(result);
        //       } else {
        //         console.error(`error fetching directions ${result}`);
        //       }
        //     });

        //     this.setState({
        //       directions: directions,
        //     });
        //   }

        // // otherwise just show Waypoint markers
        // } else {
          // let markers = [];
          // for (let i = 0; i < this.props.searchResults.length; i++){
          //   markers.push({position: this.props.searchResults[i].geometry.location});
          // }
          // console.log(markers);
          // this.setState({
          //   markers: markers,
          // });
          
          const google = window.google;
          const places = this.props.searchResults;
          const bounds = new google.maps.LatLngBounds();

          console.log(places);

          places.forEach(place => {
            // if (place.geometry.viewport) {
            //   bounds.union(place.geometry.viewport);
            // } else {
              bounds.extend(place.geometry.location);
            // }
          });
          const markers = places.map(place => ({
            position: place.geometry.location,
          }));
          const center = bounds.getCenter();

          console.log(bounds);

          this.setState({
            bounds: bounds,
            center: center,
            markers: markers,
          });
          // this.refs.map.fitBounds(bounds);
        // }
      }
    },

    componentDidMount(){
      // if (this.props.searchResults){
      //   const google = window.google;
      //   const places = this.props.searchResults;
      //   const bounds = new google.maps.LatLngBounds();        

      //   console.log(places)
        
      //   // extend map bounds to include all stop overs
      //   places.forEach(place => {
      //       bounds.extend(place.geometry.location);
      //   });

      //   // set stop over marker positions
      //   const markers = places.map(place => ({
      //     position: place.geometry.location,
      //   }));

      //   // set center to geographic center of markers 
      //   const center = bounds.getCenter();

      //   this.setState({
      //     bounds: bounds,
      //     center: center,
      //     markers: markers,
      //     // zoom: zoom,
      //   });
      // }
    },

    componentWillMount(){
      const refs = {};
      let center = {
        lat: 43.653226, lng: -79.383184 // Toronto
      };
      let markers = [];
      // let zoom = 5;

      this.setState({
        bounds: null,
        center: center,
        markers: markers,
        // zoom: zoom,
        
        onMapMounted: ref => {
          refs.map = ref;
        },
      });
      // onPlacesChanged: () => {
      // },
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    ref={ props.onMapMounted }
    // defaultZoom={ props.zoom }
    center={ props.center }
    bounds={ props.bounds }
    onBoundsChanged={ props.onBoundsChanged }
    defaultZoom={4}
    // defaultCenter={new google.maps.LatLng(43.653226, -79.383184)} // Toronto
  >
    {props.isMarkerShown && ( props.markers? props.markers.map( (marker, index) => <Marker key={ index } position={ marker.position } />) : "" ) }
    {props.directions && (props.directions.map( (direction, index) => <DirectionsRenderer key={ index } directions={ direction } />) ) }
  </GoogleMap>
  );

export default MapWithADirectionsRenderer;