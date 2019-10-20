import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HomePage extends Component{
    render() {
        return (<div>
            <h1 style={{textAlign: "center"}}> JifCam </h1>
            <div style={{textAlign: "center"}}>
                
                <p> <Link to="/admin"> Login </Link> </p>
            </div>
        </div>)
    }
}

export default HomePage;