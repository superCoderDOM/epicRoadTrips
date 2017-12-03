import React from 'react';

class OptimizedRoute extends React.Component{
    render(){

        let epicRoadTripJSX = this.props.epicRoadTrip.testRoadTrip.map( (waypoint, index) => {
            return (
                <li key={ index }>{ waypoint }</li>
            );
        })

        return(
            <div>
                <h2 className="mt-2"> Optimized Route </h2>
                <p> Distance: { this.props.epicRoadTrip.totalTripDistance / 1000 } km </p>
                <p> Duration: { this.props.secondsToString(this.props.epicRoadTrip.totalTripDuration) } </p>
                <ul>
                    { epicRoadTripJSX }
                </ul>
            </div>
        );
    }
}

export default OptimizedRoute;