// npm packages
import React from 'react';

class ToolBar extends React.Component{
    render(){
        return(
            <div className="navbar-nav my-2">
                <form onSubmit={ this.props.submitHandler } className="form-inline my-lg-0" >
                    <div className="input-group">
                        <button className="input-group-addon" type="submit"><i className="fas fa-map-marked"></i></button>
                        <input type="search" className="form-control " name="keywords" placeholder="Search places by keywords" width="500px" />
                        <div className="btn-group ml-2">
                        <button className="btn btn-warning btn-sm" onClick={ this.props.setModeCar }><i class="fas fa-car"></i></button>
                        <button className="btn btn-light btn-sm" onClick={ this.props.setModeBike }><i class="fas fa-bicycle"></i></button>
                        <button className="btn btn-light btn-sm" onClick={ this.props.setModeWalk }><i class="fas fa-walking"></i></button>
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