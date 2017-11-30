import React from 'react';
// import Jumbotron from './Jumbotron';
import TripCarousel from './TripCarousel'

class Home extends React.Component{
    render(){
        return(
            <div>
                {/* <Jumbotron /> */}
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