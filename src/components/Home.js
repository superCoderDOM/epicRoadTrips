import React from 'react';
import { Link } from 'react-router-dom';
import TripCarousel from './TripCarousel';

class Home extends React.Component{
    render(){
        return(
            <div className="homepage">
                <div className="text-overlay">
                    <h1 className="display-1"> Epic Road Trips </h1>
                    <p className="lead"> The world has so many amazing places to see...
                    <br/> What are you waiting for? 
                    <br/> Start your own epic journey now! </p>
                    <Link to="/tripbuilder" className="btn btn-warning"> START YOUR JOURNEY </Link>
                </div>
                <TripCarousel 
                    match={ this.props.match } 
                    title={ this.props.title } 
                    trips={ this.props.trips } 
                    addToList={ this.props.addToList } 
                    secondsToString={ this.props.secondsToString }
                />
            </div>
        );
    }
}

export default Home;