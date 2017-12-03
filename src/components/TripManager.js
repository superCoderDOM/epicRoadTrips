import React from 'react';
import OptimizedRoute from './OptimizedRoute';

class TripManager extends React.Component{
    render(){

        let waypointsJSX = this.props.waypointList.map((waypoint, index) => {
            if(index === 0){
                return null;
            }
            return(
                <div className="place-card" key={ waypoint }><span className="place-card_index">{ index + 1 }</span><span className="place-card_text" width={"70%"}>{ waypoint }</span><span className="place-card_button" onClick={ ()=>{this.props.removeWaypoint( waypoint )} }><i className="material-icons">delete</i></span></div>
            );
        });

        return(
            <div id="right-panel" className="col-4">
                <button className="btn btn-warning" onClick={ this.props.findOptimalRoute } >OPTIMIZE ROADTRIP</button>
                <div className="mt-2">
                    <h4><strong> Origin: </strong></h4>
                    <div className="place-card"><span className="place-card_index">{ this.props.waypointList.length > 0 ? "1" : "" }</span><span className="place-card_text" width={"70%"}>{ this.props.waypointList[0] }</span><span className="place-card_button"></span></div>
                    <h4><strong> Stop Overs: </strong></h4>
                    <div>
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