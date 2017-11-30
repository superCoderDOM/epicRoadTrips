import React from 'react';
import SearchBar from './SearchBar';

class Jumbotron extends React.Component{
    render(){
        return(
            <header className="jumbotron">
                <h1 className="display-1"> Epic Road Trips </h1>
                <p className="lead"> The world has so many amazing places to see...<br/> What are you waiting for? <br/> Start your own epic journey now </p>
                <SearchBar submitHandler={ this.props.submitHandler }/>
            </header>
        );
    }
}

export default Jumbotron