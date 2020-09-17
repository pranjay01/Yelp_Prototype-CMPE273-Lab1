import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import serverUrl from '../../config';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogout = this.handleLogout.bind(this);
  }
  //handle logout to destroy the cookie
  handleLogout = () => {
    var data = {
      token: cookie.load('cookie'),
    };
    axios.post(serverUrl + 'logout', data).then((response) => {});
    cookie.remove('cookie', { path: '/' });
    cookie.remove('userrole', { path: '/' });
  };
  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      // console.log('cookie not found');
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header"></div>
            <ul className="nav navbar-nav navbar-left">
              <li className="active">
                <Link to="/home">Write a Review</Link>
              </li>
              <li>
                <Link to="/create">Events</Link>
              </li>
              <li>
                <Link to="/delete">Talk</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="active">
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/create">Signup</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
