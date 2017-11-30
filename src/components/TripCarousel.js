import React from 'react';
import { Link } from 'react-router-dom';

class TripCarousel extends React.Component{
    render(){

        const tripSlideTargetJSX = this.props.trips.map((trip, index) => {
            return(
                <li key={ trip._id } data-target="#tripCarousel" data-slide-to={ index } className={ index === 0 ? "active" : ""}></li>    
            );
        });

        const tripSlideJSX = this.props.trips.map((trip, index) => {
            return(
                <div key={ trip._id } className={ index === 0 ? "carousel-item active" : "carousel-item" }>
                    <img className="d-block w-100" src={ trip.image_url } alt={`Slide ${index}`} />
                    <div className="carousel-caption d-none d-md-block">
                        <Link to={`/curated/trips/${ trip._id }`} ><h3> { trip.trip_name } </h3></Link>
                    </div>
                </div>
            );
        });

        return(
            <div>
                <div className="text-overlay">
                    <h1 className="display-1"> Epic Road Trips </h1>
                    <p className="lead"> The world has so many amazing places to see...
                    <br/> What are you waiting for? 
                    <br/> Start your own epic journey now! </p>
                    <Link to="/tripbuilder" className="btn btn-warning"> START YOUR JOURNEY </Link>
                </div>
                <div id="tripCarousel" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                        { tripSlideTargetJSX }
                </ol>
                    <div className="carousel-inner">
                        { tripSlideJSX }
                    </div>
                    <Link className="carousel-control-prev" to="#tripCarousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </Link>
                    <Link className="carousel-control-next" to="#tripCarousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </Link>
                </div>
            </div>
        );
    }
}

export default TripCarousel;