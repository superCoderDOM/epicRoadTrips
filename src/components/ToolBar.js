// npm packages
import React from 'react';

class ToolBar extends React.Component{
    render(){

        let travelModeDriving = this.props.travelMode === 'driving'? "btn btn-warning btn-sm" : "btn btn-light btn-sm";
        let travelModeBiking  = this.props.travelMode === 'biking' ? "btn btn-warning btn-sm" : "btn btn-light btn-sm";
        let travelModeWalking = this.props.travelMode === 'walking'? "btn btn-warning btn-sm" : "btn btn-light btn-sm";

        return(
            <div className="my-2">
                <form onSubmit={ this.props.submitHandler } className="form-inline my-lg-0">
                        <div className="input-group col-12 col-sm-6 my-2">
                            <button className="input-group-addon" type="submit"><i className="fas fa-map-marked"></i></button>
                            <input type="search" className="form-control search-field" name="keywords" placeholder="Search places by keywords" />
                        </div>
                    <div className="input-group col-12 col-sm-6 my-2">
                        <div className="btn-group ml-2">
                            <button className={ travelModeDriving } onClick={ ()=>{this.props.setTravelMode('driving')} }><i className="fas fa-car"></i></button>
                            <button className={ travelModeBiking } onClick={ ()=>{this.props.setTravelMode('biking')} }><i className="fas fa-bicycle"></i></button>
                            <button className={ travelModeWalking } onClick={ ()=>{this.props.setTravelMode('walking')} }><i className="fas fa-walking"></i></button>
                        </div>
                        <button className="btn btn-warning btn-sm ml-2" onClick={ this.props.resetStopOvers }> RESET </button>
                        <button className="btn btn-warning btn-sm ml-2" onClick={ this.props.findOptimalRoute }> OPTIMIZE </button>
                        {this.props.epicRoadTrip.testRoadTrip?
                            <button className="btn btn-warning ml-2" onClick={ this.props.openRoadTripFormNew }> SAVE </button> : ""
                        }
                    </div>
                </form>
            </div>
        );
    }
}

export default ToolBar;