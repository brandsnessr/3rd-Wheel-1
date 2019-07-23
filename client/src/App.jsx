import React from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom'
import axios from 'axios';
import "./App.css";
// import getLocation from '../helpers/index';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Profile from './components/Profile';
import HotSpots from './components/HotSpots';
import Pending from './components/Pending';
import Matches from './components/Matches';
import Signup from './components/Signup';
import Login from './components/Login';
import Interests from './components/Interests';


class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      user: {},
      isLoggedIn: false,
      failedLogin: false,
      interests: [null, null, null]
    }
    
    this.showAuthFail = this.showAuthFail.bind(this);
    this.setInterests = this.setInterests.bind(this); 
    this.getUserInfo = this.getUserInfo.bind(this);
    this.gateKeeper = this.gateKeeper.bind(this);
    this.openGate = this.openGate.bind(this);
    this.logout = this.logout.bind(this);
    // attempt to get user data initially.
    // if no cookie, middleware redirects.
    
    this.gateKeeper();
  }

  // function to flip bool and get user info when signup succeeds
  gateKeeper() {
    
    return this.getUserInfo()
    .then(response => {
      // console.log('test', response);
      if (typeof response.data === 'object'){
        this.openGate(response);
        console.log(response);
        const successCallback = async (position) => {
          // By using the 'maximumAge' option above, the position
          // object is guaranteed to be at most 10 minutes old.
          // could send timestamp too!
          try {
            const { longitude, latitude } = position.coords;
            console.log(longitude, latitude);

            const data = await axios.patch('/users', { longitude, latitude })
            this.setUser(data);
          } catch(err) {
            console.warn(err);
          }         
        }
        
        const errorCallback = async () => {
          // Update a div element with error.message.
          return await this.showAuthFail();
        }

        return navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { maximumAge: 600000 })
      }
    })
    .catch(err => { 
      console.warn(err);
      this.showAuthFail();
    });
  }

  logout() {
    console.log('clicked');
    axios.get('/logout');
    this.setState({
      isLoggedIn: false,
    })
  }

  setInterests(array) {
    this.setState({
      interests: array,
    })
  }

  getUserInfo() {
    // no auto login happening. send get to login instead?
    return axios.get('/users');
  }

  showAuthFail() {
    this.setState({
      failedLogin: true,
    })
  }

  openGate(response) {
    this.setState({
      isLoggedIn: !this.state.isLoggedIn,
      user: response.data,
    })

  }

  setUser(user) {
    this.setState({
      user: user.data,
     
    })
    console.log(this.state.user);
  }

  render() {
    const { isLoggedIn, failedLogin, user } = this.state;

    return (
      <div className="App" >
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">3rd-Wheel</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
        { 
          isLoggedIn ? 
          // logged in nav
          <Nav className="top-bar">
            <NavDropdown title="Your Card" id="basic-nav-dropdown">
              <Link className="dropdown-item" to="/profile" >Profile</Link>
              <Link className="dropdown-item" to="/interests" >Interests</Link>
            </NavDropdown>
            <Link className="nav-link" to="/hotspots" >Hot Spots</Link>
<<<<<<< HEAD
            <Link className="nav-link" to="/matches" >Find Matches</Link>
            <Link className="nav-link" to="/pending" >Mutual Interests</Link>
=======
            <Link className="nav-link" to="/matches" >Matches</Link>
            <Link className="nav-link" to="/pending" >Pending</Link>
            <Link className="nav-link" to="/signin"onClick={this.logout} >Logout</Link>
>>>>>>> 67a0be4036ca15149466bc200525ed228e31a2ec
            {/*  // Make this sign out user and relocate them to sign in
              <Link className="nav-link" to="/signin" >Sign out</Link> */}
          </Nav>
          : 
          // not logged in nav
          <Nav className="top-bar">
            <Link className="nav-link" to="/signup" >Sign up</Link>
            <Link className="nav-link" to="/login" >Log in</Link>
          </Nav>
        }
          </Navbar.Collapse>
        </Navbar>
        { 
          isLoggedIn ? 
          // !loggedIn routes
            <Switch>
              <Route exact path="/" components={() => {
                <Redirect to="/profile" />
              }} />
              <Route path="/matches" render={(props) => <Matches {...props} user={user} />}  />
              <Route path="/interests" render={(props) => <Interests {...props} user={user} setInterests={this.setInterests} />} />
              <Route path="/hotspots" render={(props) => <HotSpots {...props} user={user} />} />
              <Route path="/pending" render={(props) => <Pending {...props} user={user} />} />
              <Route path="/profile" render={(props) => <Profile {...props} user={user} failedLogin={failedLogin} />} />
            </Switch>
          :
          // !loggedIn routes
            <Switch>
              <Route exact path="/" render={() => (
                <Redirect to="/signup"/>
              )} />
              <Route path="/signup" render={(props) => <Signup {...props} showAuthFail={this.showAuthFail} gateKeeper={this.gateKeeper} isLoggedIn={isLoggedIn} />} />
              <Route path="/login" render={(props) => <Login {...props} showAuthFail={this.showAuthFail} gateKeeper={this.gateKeeper} isLoggedIn={isLoggedIn} />} />
            </Switch>
        }
      </div>
    )
  }
}

export default App;