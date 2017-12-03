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
                    <div className="navbar_group">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item"><NavLink className="nav-link" to="/" exact> Home </NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/tripbuilder"> Trip Builder </NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/curated/trips"> Curated Road Trips </NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/about"> About </NavLink></li>
                        </ul>
                    </div>
                    <div className="navbar_group">
                        <ul className="navbar-nav mr-auto">
                            { this.props.userName? <li className="nav-item"><span className="nav-link"> Hello { this.props.userName }</span></li> : "" }
                            { this.props.userName? <li className="nav-item"><NavLink className="nav-link" to="/private/trips"> Your Road Trips { this.props.numUserTrips }</NavLink></li> : "" }
                            { this.props.userName? "" : <li><button className="btn btn-outline-secondary mr-2  my-2 my-sm-0" onClick={ this.props.requestRegistration }> SIGN UP </button></li> }
                            { this.props.userName?
                                <li><button className="btn btn-outline-secondary my-2 my-sm-0" onClick={ this.props.logUserOut }> LOGOUT </button></li> :
                                <li><button className="btn btn-outline-secondary my-2 my-sm-0" onClick={ this.props.requestLogin }> LOGIN </button></li> }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;