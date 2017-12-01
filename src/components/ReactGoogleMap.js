// npm packages
import React from "react"
import { compose, lifecycle, withProps, withStateHandlers } from "recompose"
import { DirectionsRenderer, GoogleMap, Marker, withGoogleMap, withScriptjs } from "react-google-maps"
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox";

// local file dependencies
import customMapStyles from "./retroMapStyles.json";
import testCases from "./epicRoadTrip-testdata";
import keys from '../keys';

/* global google */
const google = window.google;
const GOOGLE_MAPS_API_KEY = keys.GOOGLE_MAPS_API_KEY;
const route = testCases.epicSegments[1]; // testSegment; // 

const MyMapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService();

      // DirectionsService.route({
      //   origin: new google.maps.LatLng(41.8507300, -87.6512600),
      //   destination: new google.maps.LatLng(41.8525800, -87.6514100),
      //   travelMode: google.maps.TravelMode.DRIVING,
      // }, (result, status) => {
      //   if (status === google.maps.DirectionsStatus.OK) {
      //     this.setState({
      //       directions: result,
      //     });
      //   } else {
      //     console.error(`error fetching directions ${result}`);
      //   }
      // });
      this.setState({
        directions: route,
      });
    }
  }),
)(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new google.maps.LatLng(43.6532, -79.3832)}
    defaultOptions={{ styles: customMapStyles }}    
  >
    <Marker position={ markers } />

    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
);

class GoogleMapComponent extends React.Component{
  render(){
    return(
      <MyMapComponent style={ customMapStyles }/>
    );
  }
}
export default GoogleMapComponent;