import React from 'react';

class FormLogIn extends React.Component{
    render(){

        let url = this.props.matchURL;

        return(
            <section>
                <form onSubmit={ this.props.submitHandler }>
                    { url === '/register'? 
                        <div>
                            <label htmlFor="userName"> Name </label>
                            <input type="text" id="userName" name="userName" placeholder="Name" />
                        </div> : "" }
                    <label htmlFor="userEmail"> Email </label>
                    <input type="text" id="userEmail" name="userEmail" placeholder="travel.junky@epicroadtrips.org" />
                    <label htmlFor="userPassword"> Password </label>
                    <input type="text" id="userPassword" name="userPassword" placeholder="Y0urP@55w0rD" />
                    <NavLink to="/"> CANCEL </NavLink>
                    <input type="submit" value={ this.props.clickHandler } />
                </form>
            </section>
        );
    }
}

export default FormLogIn;