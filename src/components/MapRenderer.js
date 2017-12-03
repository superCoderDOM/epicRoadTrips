import React from 'react';
import keys from '../keys';

/* global google */
const GOOGLE_MAPS_API_KEY = keys.GOOGLE_MAPS_API_KEY;
const { compose, withProps, lifecycle } = require("recompose");
const { withScriptjs, withGoogleMap,GoogleMap, Marker, DirectionsRenderer } = require("react-google-maps");

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `80vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidUpdate(prevProps, prevState) {
      if (prevProps !== this.props){
          const DirectionsService = new google.maps.DirectionsService();

        // render epic road trip if defined
        if (this.props.epicRoadTrip.length > 0){
          let directions = [];
          for (let i = 1; i < this.props.epicRoadTrip; i++){
            DirectionsService.route({
              origin: this.props.epicRoadTrip.testRoadTrip[i - 1],
              destination: this.props.epicRoadTrip.testRoadTrip[i],
              travelMode: this.props.travelMode,
            }, (result, status) => {

              if (status === google.maps.DirectionsStatus.OK) {
                directions.push(result);
              } else {
                console.error(`error fetching directions ${result}`);
              }
            });

            this.setState({
              directions: directions,
            });
          }
        // otherwise just show markers
        } else {
          let markers = [];
          for (let i = 0; i < this.props.searchResults.length; i++) {
            markers.push(this.props.searchResults[i].geometry.location);
          }
          console.log(markers)
          this.setState({
            markers: markers,
          });
        }
      }
    }
  })
)(props =>
  <GoogleMap
    defaultZoom={4}
    defaultCenter={new google.maps.LatLng(43.653226, -79.383184)} // Toronto
  >
    {props.isMarkerShown && ( props.markers? props.markers.map( (marker, index) => <Marker key={ index } position={ marker } />) : "" ) }
    {props.directions && (props.directions.map( (direction, index) => <DirectionsRenderer key={ index } directions={ direction } />) ) }
  </GoogleMap>
  );

export default MapWithADirectionsRenderer;