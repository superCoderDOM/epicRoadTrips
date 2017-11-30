import React from 'react';

class TripManager extends React.Component{
    render(){

        let waypointsJSX = this.props.waypointList.map((waypoint, index) => {
            if(index === 0){
                return null;
            }
            return(
                <li key={ index }> { waypoint } </li>
            );
        });

        return(
            <div id="right-panel" className="col-4">
                <button className="btn btn-warning" onClick={ this.props.findOptimalRoute } >OPTIMIZE ROADTRIP</button>
                <div className="mt-2">
                    <h4><strong> Origin: </strong></h4>
                    <p>{ this.props.waypointList[0] }</p>
                    <h4><strong> Stop Overs: </strong></h4>
                    <ol>
                        { waypointsJSX }
                    </ol>
                </div>
            </div>
        );
    }
}

export default TripManager;