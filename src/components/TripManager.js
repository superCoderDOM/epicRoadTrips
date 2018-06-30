import React from 'react';
import OptimizedRoute from './OptimizedRoute';

// API keys
import keys from '../keys';

class TripManager extends React.Component{
    render(){

        let sidebarClassList = this.props.showSidebar? "sidebar sidebar__expand col-12 col-md-6 col-lg-4" : "sidebar sidebar__hide col-12 col-md-6 col-lg-4";
        let sidebarTriggerClassList = this.props.showSidebar? "sidebar-trigger sidebar-trigger__expand" : "sidebar-trigger sidebar-trigger__hide";
        let sidebarTriggerIconClassList = this.props.showSidebar? "fas fa-angle-right" : "fas fa-angle-left";
        let sidebarTriggerContentClassList = this.props.showSidebar? "" : "hidden";

        let waypointsJSX = this.props.searchResults.map((waypoint, index) => {
            
            // let waypointName = `${waypoint.name}, ${waypoint.formatted_address}`;
            // if(waypoint.formatted_address > waypoint.name){
            //     waypointName = waypoint.formatted_address;
            // }else{
            //     waypointName = waypoint.name;                
            // }

            return(
                <div className="waypoint row mb-1 dflex justify-content-between" key={ waypoint.id }>
                    <div>
                        <span className="badge badge-warning badge-width"> { index + 1 } </span>
                        <span className="ml-2"><strong> { waypoint.name } </strong></span>
                    </div>
                    <button type="button" className="close" aria-label="Delete stopover" onClick={ ()=>{this.props.removeWaypoint( waypoint.id )} }>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    {/* <img className="col-12" src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${waypoint.photos[0].photo_reference}&key=${keys.GOOGLE_MAPS_API_KEY}`} alt="" width={"90%"}/> */}
                </div>
            );
        });

        return(
            <div id="trip-manager" className={ sidebarClassList }>
                <div className={ sidebarTriggerClassList } onClick={ this.props.toggleSidebar } aria-label="Toggle sidebar"><i className={ sidebarTriggerIconClassList }></i></div>
                <div className={ sidebarTriggerContentClassList }>
                    <h4><i className="fas fa-map-marker-alt"></i> Stopovers </h4>
                    <div className="d-flex flex-row-reverse flex-wrap-reverse align-content-start">
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