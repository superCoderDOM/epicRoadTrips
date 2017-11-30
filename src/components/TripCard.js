// npm packages
import React from 'react';
import { Link } from 'react-router-dom';

// 'Curated Trips' document format example
    // _id: "test04",
    // trip_name: "Title",
    // optimized_route: [],
    // estimated_travel_distance: 19875030,
    // estimated_travel_duration: 19823847,
    // image_url: "https://vagabond3.com/wp-content/uploads/2011/10/IMG_9478.jpg",
    // vote_count: 0,
    // save_count: 0,
    // comments: [],
    // created: "2017-01-17",
    // updated: "2017-01-17",


class TripCard extends React.Component{

    render(){

        let trip = this.props.trip;

        return(
            <div className="card">
                <Link to={`/curated/trips/${ trip._id }`}>
                    <img className="card-img-top" src={ trip.image_url } alt="" />
                </Link>
                <div className="card-body">
                    <Link to={`/curated/trips/${ trip._id }`}>
                        <h4 className="card-title"> { trip.trip_name } </h4>
                    </Link>
                    <p className="card-text h6"> { trip.estimated_travel_distance / 1000 } km </p>
                    <p className="card-text h6"> { this.props.secondsToString(trip.estimated_travel_duration) } </p>
                    <p className="card-text h6"> { trip.description } </p>
                    <p className="card-text h6 mt-3"> Created: { trip.created } </p>
                    {this.props.match.url !== '/private/trips'? 
                        <div>
                            <button className="btn btn-secondary" onClick={ ()=>this.props.addToCart(trip._id) }> Add </button>
                        </div> :
                        <div>
                            <button className="btn btn-secondary" onClick={ ()=>this.props.removeFromCart(trip._id) }> Remove </button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default TripCard;