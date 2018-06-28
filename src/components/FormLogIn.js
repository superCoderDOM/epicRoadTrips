import React from 'react';

class FormLogIn extends React.Component{
    render(){
        return(
            <section className="login-form">
                <form onSubmit={ this.props.submitHandler }>
                    { this.props.newUser? 
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
                        <input className="form-control" type="email" id="userEmail" name="userEmail" placeholder="travel.junky@epicroadtrips.org" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userPassword"> Password </label>
                        <input className="form-control" type="password" id="userPassword" name="userPassword" placeholder="Y0urP@55w0rD" />
                    </div>
                    { this.props.newUser?
                        <h2> Thanks for joining our community! </h2> :
                        <h2> Thanks for being part of our community! </h2>
                    }
                    <div className="button-group">
                        <button className="btn btn-warning" onClick={ this.props.closeLoginForm }> CANCEL </button>
                        <input className="btn btn-secondary" type="submit" onSubmit={ this.props.submitHandler } />
                    </div>
                </form>
            </section>
        );
    }
}

export default FormLogIn;