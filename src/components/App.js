import React from 'React';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';
import Airtable from 'airtable';
import loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';

import TristnAppBar from './TristnAppBar';
import MainView from './MainView'
import SiteSelect from './SiteSelect';
import sitcAirtable from './../api/sitcAirtable';
import Auth from './../api/Auth';

const styles = theme => ({
  root: {
    width: '100%'
  }
});

class App extends React.Component {
  constructor () {
    super();

    this.state = {
      volunteerInfo: {},
      filteredVolunteerIds: [],
      checkedInTeers: [],
      notCheckedInTeers: [],
      auth: new Auth(),
      carpoolSites: {},
      defaultCarpoolSiteId: '',
    }

    this.updateVolunteerInfo = this.updateVolunteerInfo.bind(this);
    this.updateCheckedInTeers = this.updateCheckedInTeers.bind(this);
    this.updateNotCheckedInTeers = this.updateNotCheckedInTeers.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.updateDefaultCarpoolSite = this.updateDefaultCarpoolSite.bind(this);
  }

  componentDidMount () {

    let renewSessionPromise = null;
    if (localStorage.getItem('isLoggedIn') === 'true') {
      renewSessionPromise = this.props.auth.renewSession();
      loglevel.info("user is logged in!");
    } else {
      renewSessionPromise = new Promise((resolve, reject) => resolve());
    }

    renewSessionPromise.then(() => {
      if (!this.props.auth.isAuthenticated()) {
        this.props.auth.login();
      }
    });

    const carpoolSitesPromise = sitcAirtable.getCarpoolSites();
    carpoolSitesPromise.then(siteInfo => {
      loglevel.info(siteInfo);
      this.setState({carpoolSites: siteInfo});
    })

  }

  updateCarpoolSites (sites) {
    this.setState({carpoolSites: sites});
  }

  updateDefaultCarpoolSite (siteId) {
    this.setState({defaultCarpoolSiteId: siteId});
  }

  updateVolunteerInfo (info) {
    this.setState({volunteerInfo: info});
  }

  updateCheckedInTeers (info) {
    this.setState({checkedInTeers: info})
    loglevel.info(info);
  }

  updateNotCheckedInTeers (info) {
    this.setState({notCheckedInTeers: info});
    loglevel.info(info);
  }

  setFilter (filteredTeers) {
    loglevel.debug(filteredTeers);
    this.setState({filteredVolunteerIds: filteredTeers});
  }

  handleAuthentication (nextState) {
    this.props.auth.handleAuthentication();
  }

  render () {
    const { classes } = this.props;

    return (
      <div id="Root" className={classes.root}>
        <React.Fragment key="1">
          <TristnAppBar
            setFilter={this.setFilter}
            volunteerInfo={this.state.volunteerInfo}
          />
          <Switch>
            <Route exact path="/" render={routeProps => (
              <MainView
                {...routeProps}
                auth = {this.props.auth}
                updateVolunteerInfo={this.updateVolunteerInfo}
                updateCheckedInTeers={this.updateCheckedInTeers}
                updateNotCheckedInTeers={this.updateNotCheckedInTeers}
                volunteerInfo={this.state.volunteerInfo}
                filteredVolunteerIds={this.state.filteredVolunteerIds}
                checkedInTeers={this.state.checkedInTeers}
                notCheckedIn={this.state.notCheckedInTeers}
              />
            )} />
            <Route path="/siteSelect" render={routeProps => {
              return (
                <SiteSelect
                  open={true}
                  carpoolSites={this.state.carpoolSites}
                  updateDefaultCarpoolSite={this.updateDefaultCarpoolSite}
                  handleAuthentication={this.handleAuthentication}
                />
              );
            }} />
            <Route path="/home" render={routeProps => (
              <div>
                <h1>Well this is awkward.</h1>
                <h4>Wump, wump</h4>
              </div>
            )} />
          </Switch>
        </React.Fragment>
      </div>
    )
  }

}

export default withStyles(styles)(App);
