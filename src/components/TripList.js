// npm packages
import React from 'react';
import { Helmet } from 'react-helmet';

// components
import TripCard from './TripCard';

class TripList extends React.Component{
    render(){
        const tripsJSX = this.props.trips.map(trip=>{
            return(
                <TripCard key={ trip._id } match={ this.props.match } trip={ trip } addToList={ this.props.addToList } removeFromList={ this.props.removeFromList } secondsToString={ this.props.secondsToString }/>
            );
        });

        return(
            <section className="container-fluid">
                <Helmet>
                    <title> Epic Road Trips | { this.props.title } </title>
                </Helmet>
                <div className="row mt-3">
                    <div className="title-line">
                        <h1 className="ml-2"> { this.props.title } </h1>
                        <div className="lead"> { this.props.subtitle } </div>
                    </div>
                </div>
                <div className="row">
                    <div className="card-deck">
                        { tripsJSX }
                    </div>
                </div>
            </section>
        );
    }
}

export default TripList;