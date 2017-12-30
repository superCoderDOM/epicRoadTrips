import React from 'react';
import MapRenderer from './MapRenderer';
import SearchBar from './SearchBar';
import TripManager from './TripManager';
import retroMapStyles from "./retroMapStyles.json";

class TripBuilder extends React.Component{
    render(){
        return(
            <section className="container-fluid">
                <div className="row mt-3">
                    <div className="col-6">
                        <div className="mb-2">
                            <SearchBar submitHandler={ this.props.submitHandler }/>
                        </div>
                        <div className={ this.props.mapLoading? "loading" : "hidden" }>
                            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                            <span className="sr-only">Loading...</span>
                        </div>
                        <MapRenderer 
                            epicRoadTrip={ this.props.epicRoadTrip }
                            searchResults={ this.props.searchResults } 
                            style={ retroMapStyles } isMarkerShown={ true }
                        />
                    </div>
                    <TripManager 
                        addToList={ this.props.addToList } 
                        addWaypointToList={ this.props.addWaypointToList } 
                        findOptimalRoute={ this.props.findOptimalRoute }
                        match={ this.props.match }
                        openRoadTripFormNew={ this.props.openRoadTripFormNew }
                        removeWaypoint = { this.props.removeWaypoint }
                        resetStopOvers = { this.props.resetStopOvers }
                        searchResults={ this.props.searchResults }
                        secondsToString={ this.props.secondsToString }
                        title={ this.props.title }
                        trips={ this.props.trips } 
                        waypointList={ this.props.waypointList }
                        epicRoadTrip={ this.props.epicRoadTrip } 
                    />
                </div>
            </section>
        );
    }
}

export default TripBuilder;