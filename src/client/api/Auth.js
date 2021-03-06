import history from './history';
import auth0 from 'auth0-js';
import loglevel from 'loglevel';

export default class Auth {

  // workaround so that site can be accessed from my phone during development


  constructor() {
    let myBaseUri = '';
    if (window.location.href.includes("192.168")) {
      myBaseUri = "192.168.86.55";
    } else {
      myBaseUri = "0.0.0.0";
    }

    this.auth0 = new auth0.WebAuth({
      domain: 'summerinthecity.auth0.com',
      clientID: 'XJ5VkwWwHdezACsGozgDoSLFzTdBXAoj',
      redirectUri: `http://${myBaseUri}:3030/siteSelect`,
      responseType: 'token id_token',
      scope: 'openid'
    });

    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = null;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        loglevel.info("About to call setSession");
        this.setSession(authResult);
      } else if (err) {
        history.replace('/home');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    // navigate to the home route
    // history.replace('/home');
  }

  renewSession() {
    const myPromise = new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
         if (authResult && authResult.accessToken && authResult.idToken) {
           this.setSession(authResult);
           resolve();
         } else if (err) {
           this.logout();
           console.log(err);
           alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
         }
      });
    });
    return myPromise;
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    // navigate to the home route
    history.replace('/home');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    loglevel.info("expiresAt: " + expiresAt);
    return new Date().getTime() < expiresAt;
  }
}
