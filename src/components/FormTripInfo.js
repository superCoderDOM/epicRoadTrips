import React from 'react';

/* User Trip Schema:
    trip_name: {type: String, required: true},
    waypoint_list: {type: Array, required: true},
    optimized_route: {type: Array, required: true},
    estimated_travel_distance: {type: Number, required: true},
    estimated_travel_duration: {type: Number, required: true},
    image_url: {type: String},    
    created: {type: Date, required: true},
    updated: {type: Date, required: true},
*/

class FormTripInfo extends React.Component{
    render(){

        let waypointsJSX = this.props.waypointList.map((waypoint, index) => {
            return(
                <li key={ waypoint }>{ waypoint }</li>
            );
        });

        return(
            <section className="login-form">
                <form onSubmit={ this.props.submitHandler }>
                    <div>
                        { this.props.newTrip? 
                            <h1> Save Your Epic Road Trip </h1> :
                            <h1> Tweak Your Epic Road Trip </h1>
                        }
                        <div className="form-group">
                            <label htmlFor="trip_name"> Your trip's name </label>
                            <input className="form-control" type="text" id="trip_name" name="trip_name" placeholder="Name your trip" />
                        </div>
                    </div> 
                    <div id="waypoint_list">
                        <div > Waypoint List </div>
                        <div data-spy="scroll" data-target="#waypoint_list" data-offset="0">
                            <ul>
                                { waypointsJSX }
                            </ul>
                        </div>
                    </div>
                    <div className="form-group">
                        <div> Distance: </div>
                        <div>{ Math.floor(this.props.epicRoadTrip.totalTripDistance / 1000) } km</div>
                    </div>
                    <div className="form-group">
                        <div> Duration: </div>
                        <div>{ this.props.secondsToString(this.props.epicRoadTrip.totalTripDuration) }</div>
                    </div>
                    <h2> Have an epic road trip! </h2>
                    <div className="button-group">
                        <button className="btn btn-secondary" onClick={ this.props.closeTripForm }> CANCEL </button>
                        <input className="btn btn-secondary" type="submit" onSubmit={ this.props.submitHandler } value="SAVE" />
                    </div>
                </form>
            </section>
        );
    }
}

export default FormTripInfo;