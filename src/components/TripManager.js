import React from 'react';
import OptimizedRoute from './OptimizedRoute';

// API keys
import keys from '../keys';

class TripManager extends React.Component{
    render(){

        let showSidebar = '';
        let sidebarClassList = "sidebar col-12 col-md-6 col-lg-4";
        if (showSidebar === 'expand') {
            sidebarClassList += " sidebar__expand";
        } else if(showSidebar === 'hide') {
            sidebarClassList += " sidebar__hide";
        }

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
                    <div onClick={ ()=>{this.props.removeWaypoint( waypoint.id )} } ><i className="fas fa-times"></i></div>
                    {/* <img className="col-12" src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${waypoint.photos[0].photo_reference}&key=${keys.GOOGLE_MAPS_API_KEY}`} alt="" width={"90%"}/> */}
                </div>
            );
        });

        return(
            <div id="trip-manager" className={ sidebarClassList }>
                <div className="sidebar-trigger"><i class="fas fa-angle-right"></i></div>
                <div className="mt-2">
                    <h4><i class="fas fa-map-marker-alt"></i> Stopovers </h4>
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