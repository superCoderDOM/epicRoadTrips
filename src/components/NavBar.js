// npm packages
import React from 'react';
import { NavLink } from 'react-router-dom';

class NavBar extends React.Component{
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="navbar-brand"><img src="roadtrip_sm.png" alt=""/></div>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item"><NavLink className="nav-link" to="/" exact> Home </NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/tripbuilder"> Trip Builder </NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/curated/trips"> Curated Road Trips </NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/about"> About </NavLink></li>
                        { this.props.userName? <li>Welcome { this.props.userName }</li> : "" }
                        { this.props.userName? <li className="nav-item"><NavLink className="nav-link" to="/private/trips"> Your Road Trips { this.props.numUserTrips }</NavLink></li> : "" }
                        { this.props.userName? "" : <li><NavLink className="btn btn-outline-secondary mr-2  my-2 my-sm-0" to="/register"> SIGN UP </NavLink></li> }
                        { this.props.userName?
                            <li><button className="btn btn-outline-secondary my-2 my-sm-0" clickHandler={ this.props.logUserOut }> LOGOUT </button></li> :
                            <li><NavLink className="btn btn-outline-secondary my-2 my-sm-0" to="/login"> LOGIN </NavLink></li> }
                    </ul>
                </div>
            </nav>
        );
    }
}

export default NavBar;