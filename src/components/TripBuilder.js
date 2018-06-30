import React from 'react';
import MapRenderer from './MapRenderer';
import ToolBar from './ToolBar';
import TripManager from './TripManager';
import retroMapStyles from "./retroMapStyles.json";

class TripBuilder extends React.Component{
    render(){
        return(
            <section className="col-12">
                <ToolBar 
                    epicRoadTrip={ this.props.epicRoadTrip } 
                    findOptimalRoute={ this.props.findOptimalRoute }
                    removeWaypoint={ this.props.removeWaypoint }
                    resetStopOvers={ this.props.resetStopOvers }
                    searchResults={ this.props.searchResults }
                    setTravelMode={ this.props.setTravelMode }
                    submitHandler={ this.props.submitHandler }
                    travelMode={ this.props.travelMode }
                />
                <div className="trip-manager">
                    <div id="spinner" className={ this.props.mapLoading? "loading" : "hidden" }>
                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                        <span className="sr-only">Loading...</span>
                    </div>
                    <MapRenderer 
                        epicRoadTrip={ this.props.epicRoadTrip }
                        searchResults={ this.props.searchResults } 
                        style={ retroMapStyles } isMarkerShown={ true }
                    />
                    <TripManager 
                        addToList={ this.props.addToList } 
                        addWaypointToList={ this.props.addWaypointToList } 
                        epicRoadTrip={ this.props.epicRoadTrip } 
                        findOptimalRoute={ this.props.findOptimalRoute }
                        match={ this.props.match }
                        openRoadTripFormNew={ this.props.openRoadTripFormNew }
                        removeWaypoint={ this.props.removeWaypoint }
                        resetStopOvers={ this.props.resetStopOvers }
                        searchResults={ this.props.searchResults }
                        secondsToString={ this.props.secondsToString }
                        showSidebar={ this.props.showSidebar }
                        title={ this.props.title }
                        toggleSidebar={ this.props.toggleSidebar }
                        trips={ this.props.trips } 
                        waypointList={ this.props.waypointList }
                    />
                </div>
            </section>
        );
    }
}

export default TripBuilder;