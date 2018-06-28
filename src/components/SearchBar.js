// npm packages
import React from 'react';

class SearchBar extends React.Component{
    render(){
        return(
            <div className="navbar-nav">
                <form onSubmit={ this.props.submitHandler } className="form-inline my-2 my-lg-0" >
                    <div className="row">
                        <div className="input-group">
                            <button className="input-group-addon" type="submit"><i className="fas fa-map-marked"></i></button>
                            <input type="search" className="form-control " name="keywords" placeholder="Search places by keywords" width="500px" />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchBar;