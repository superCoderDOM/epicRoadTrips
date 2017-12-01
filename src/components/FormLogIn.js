import React from 'react';
import { NavLink } from 'react-router-dom';

class FormLogIn extends React.Component{
    render(){
        return(
            <section className="login-form">
                <form onSubmit={ this.props.submitHandler }>
                    { (this.props.newUser && this.props.match.url === '/register') ? 
                        (<div>
                            <h1> Welcome to Epic Road Trips </h1>
                            <div className="form-group">
                                <label htmlFor="userName"> Your name </label>
                                <input className="form-control" type="text" id="userName" name="userName" placeholder="Name" />
                            </div>
                        </div>) : 
                        <div>
                            <h1> Welcome back! </h1>
                        </div> 
                    }
                    <div className="form-group">
                        <label htmlFor="userEmail"> Email address </label>
                        <input className="form-control" type="text" id="userEmail" name="userEmail" placeholder="travel.junky@epicroadtrips.org" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userPassword"> Password </label>
                        <input className="form-control" type="text" id="userPassword" name="userPassword" placeholder="Y0urP@55w0rD" />
                    </div>
                    <h2> Thanks for joining our community! </h2>
                    <div className="button-group">
                        <NavLink className="btn btn-secondary" to="/"> CANCEL </NavLink>
                        <input className="btn btn-secondary" type="submit" value={ this.props.clickHandler } />
                    </div>
                </form>
            </section>
        );
    }
}

export default FormLogIn;