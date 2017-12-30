import React from 'react';
import OptimizedRoute from './OptimizedRoute';

// API keys
import keys from '../keys';

class TripManager extends React.Component{
    render(){

        let waypointsJSX = this.props.searchResults.map((waypoint, index) => {
            
            let maxwidth = 300;
            
            let waypointName;
            if(waypoint.formatted_address > waypoint.name){
                waypointName = waypoint.formatted_address;
            }else{
                waypointName = waypoint.name;                
            }

            return(
                <div className="card col-6 mb-1" key={ waypoint.id }>
                    <img className="card-img-top" src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${waypoint.photos[0].photo_reference}&key=${keys.GOOGLE_MAPS_API_KEY}`} alt="" width={"90%"}/>
                    <div className="card-body d-flex justify-content-between">
                        <div>
                            <span className="card-text mr-1">{ index + 1 }</span>
                            <span className="card-text">{ waypointName }</span>
                        </div>
                        <div>
                            <span className="btn btn-secondary" onClick={ ()=>{this.props.removeWaypoint( waypointName )} } width={"90%"}><i className="material-icons">delete</i></span>
                        </div>
                    </div>
                </div>
            );
        });

        return(
            <div id="right-panel" className="col-6">
                <button className="btn btn-warning mb-2 ml-2" onClick={ this.props.findOptimalRoute }> OPTIMIZE ROADTRIP </button>
                <button className="btn btn-warning mb-2 ml-2" onClick={ this.props.resetStopOvers }> RESET STOP OVERS </button>
                {this.props.epicRoadTrip?
                    <button className="btn btn-warning mb-2" onClick={ this.props.openRoadTripFormNew }> SAVE ROADTRIP </button> : ""
                }
                <div className="mt-2">
                    <h4><strong> Stop Overs: </strong></h4>
                    <div className="d-flex flex-row-reverse flex-wrap-reverse justify-content-between">
                        { waypointsJSX }
                    </div>
                    {this.props.epicRoadTrip?
                        <OptimizedRoute 
                            epicRoadTrip={ this.props.epicRoadTrip }
                            secondsToString={ this.props.secondsToString } 
                        /> : ""
                    }
                </div>
            </div>
        );
    }
}

export default TripManager;