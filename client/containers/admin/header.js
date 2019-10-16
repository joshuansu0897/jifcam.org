import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HeaderSection extends Component{
    render(){
        return (<nav className="admin-header">
            <div className="nav-wrapper">
              <Link to="/" className="brand-logo">JifCam</Link>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                
                <li><Link to="/admin/video/list">Videos</Link></li>
                <li><Link to="/admin/mails">Mails</Link></li>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li><Link to="/admin/import" className="btn"> Add Import database <i className="material-icons">add</i></Link></li>
              </ul>
            </div>
          </nav>)
    }
}

export default HeaderSection;

