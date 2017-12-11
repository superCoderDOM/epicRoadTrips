import React from 'react';
import OptimizedRoute from './OptimizedRoute';

class TripManager extends React.Component{
    render(){

        let waypointsJSX = this.props.waypointList.map((waypoint, index) => {
            return(
                <div className="place-card" key={ waypoint }><span className="place-card_index">{ index + 1 }</span><span className="place-card_text" width={"70%"}>{ waypoint }</span><span className="place-card_button" onClick={ ()=>{this.props.removeWaypoint( waypoint )} }><i className="material-icons">delete</i></span></div>
            );
        });

        return(
            <div id="right-panel" className="col-4">
                <button className="btn btn-warning" onClick={ this.props.findOptimalRoute }> OPTIMIZE ROADTRIP </button>
                <button className="btn btn-warning" onClick={ this.props.resetStopOvers }> RESET STOP OVERS </button>
                {this.props.epicRoadTrip?
                    <button className="btn btn-warning" onClick={ this.props.openRoadTripFormNew }> SAVE ROADTRIP </button> : ""
                }
                <div className="mt-2">
                    <h4><strong> Stop Overs: </strong></h4>
                    <div>
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