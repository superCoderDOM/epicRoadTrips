import React from 'react';
import OptimizedRoute from './OptimizedRoute';

// API keys
import keys from '../keys';

class TripManager extends React.Component{
    render(){

        let waypointsJSX = this.props.searchResults.map((waypoint, index) => {
            
            let maxwidth = 300;
            
            let waypointName = `${waypoint.name}, ${waypoint.formatted_address}`;
            // if(waypoint.formatted_address > waypoint.name){
            //     waypointName = waypoint.formatted_address;
            // }else{
            //     waypointName = waypoint.name;                
            // }

            return(
                <div className="card col-6 mb-1" key={ waypoint.id }>
                    <div className="card-delete-btn">
                        <span className="" onClick={ ()=>{this.props.removeWaypoint( waypoint.id )} } width={"90%"}><i className="fas fa-times"></i></span>
                    </div>
                    <img className="card-img-top" src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${waypoint.photos[0].photo_reference}&key=${keys.GOOGLE_MAPS_API_KEY}`} alt="" width={"90%"}/>
                    <div className="card-body d-flex justify-content-between">
                        <div>
                            <span className="card-text mr-1">{ index + 1 }</span>
                            <span className="card-text">{ waypointName }</span>
                        </div>
                    </div>
                </div>
            );
        });

        return(
            <div id="right-panel" className="col-6">
                <button className="btn btn-warning mb-2 mr-2" onClick={ this.props.resetStopOvers }> RESET </button>
                <button className="btn btn-warning mb-2 mr-2" onClick={ this.props.findOptimalRoute }> OPTIMIZE </button>
                {this.props.epicRoadTrip?
                    <button className="btn btn-warning mb-2" onClick={ this.props.openRoadTripFormNew }> SAVE </button> : ""
                }
                <div className="mt-2">
                    <h4><strong> Stop Overs: </strong></h4>
                    <div className="d-flex flex-row-reverse flex-wrap-reverse justify-content-between">
                        { waypointsJSX }
                    </div>
                    {this.props.epicRoadTrip.testRoadTrip?
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