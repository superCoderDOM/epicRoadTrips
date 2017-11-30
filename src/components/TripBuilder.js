import React from 'react';
import MapRenderer from './MapRenderer';
import SearchBar from './SearchBar';
import TripManager from './TripManager';

class TripBuilder extends React.Component{
    render(){
        return(
            <section>
                <div className="row mt-3">
                    <div className="col-8">
                        <div className="mb-2">
                            <SearchBar />
                        </div>
                        <MapRenderer />
                        <div className={ this.props.mapLoading? "loading" : "hidden" }>
                            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                    <TripManager 
                        addToList={ this.props.addToList } 
                        addWaypointToList={ this.props.addWaypointToList } 
                        findOptimalRoute={ this.props.findOptimalRoute }
                        match={ this.props.match }
                        secondsToString={ this.props.secondsToString }
                        title={ this.props.title }
                        trips={ this.props.trips } 
                        waypointList={ this.props.waypointList } 
                    />
                </div>
            </section>
        );
    }
}

export default TripBuilder;