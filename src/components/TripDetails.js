// npm packages
import React from 'react';
import { Helmet } from 'react-helmet';

// Trips document format example
    // _id: "test01",
    // tripName: "Rocky Mountains",
    // optimized_route: [],
    // estimated_travel_distance: 19875030,
    // estimated_travel_duration: 923847,
    // imageURL: "http://www.lonelyplanet.com/travel-blog/tip-article/wordpress_uploads/2013/03/GettyImages-478080583_full_cs.jpg",
    // vote_count: 0,
    // save_count: 0,
    // comments: [],
    // created: "2017-01-17",
    // updated: "2017-01-17",


class TripDetails extends React.Component{
    render(){

        let trip = this.props.trip;

        let tripRouteJSX;
        if(trip.optimized_route){
            if(Array.isArray(trip.optimized_route)){
                tripRouteJSX = trip.optimized_route.map((stopOver, index)=>{
                    return (
                        <li key={ index }>{ stopOver }</li>
                    );
                });
            }else{
                tripRouteJSX = <li>{ trip.optimized_route }</li>                
            }
        }

        return(
            <div className="row mt-3">
                <Helmet>
                    <title>Epic Road Trip | Trip Details</title>
                </Helmet>
                <div className="media">
                    <div className="col-8 mr-3">
                        <img src={ trip.image_url } alt="" width="100%" />
                    </div>
                    <div className="media-body col-4">
                        <h2> { trip.trip_name } </h2>
                        <ul>
                            <li><strong> Distance: </strong> { Math.floor(trip.estimated_travel_distance / 1000) } km </li>
                            <li><strong> Duration: </strong> { this.props.secondsToString(trip.estimated_travel_duration) } </li>
                            <li><strong> Stop Overs: </strong><ul> { tripRouteJSX } </ul></li>
                            {<li><strong> Votes: </strong> { trip.vote_count } <button onClick={ this.props.voteUp }><i className="material-icons">thumb_up</i></button></li>}
                            <li><strong> Saves: </strong> { trip.save_count } </li>
                            <li><strong> Created: </strong> { trip.created } </li>
                            <li><strong> Updated: </strong> { trip.updated } </li>
                        </ul>
                        <button className="btn btn-secondary" onClick={ ()=>this.props.addToList(trip._id) }> Add To Collection </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default TripDetails;