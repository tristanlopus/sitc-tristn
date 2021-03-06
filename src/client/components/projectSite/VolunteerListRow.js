import React from 'react';
import * as loglevel from 'loglevel';
// import { Transition } from 'react-transition-group';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import SvgIcon from '@material-ui/core/SvgIcon';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import AirlineSeatReclineNormalIcon from '@material-ui/icons/AirlineSeatReclineNormal';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Slide from '@material-ui/core/Slide';

class VolunteerListRow extends React.Component {

  constructor () {
    super();

    this.state = {
      avatar: '',
      // show: true
    }

    this.handleCheckInClick = this.handleCheckInClick.bind(this);
    this.exited = this.exited.bind(this);
  }

  exited () {
    loglevel.info("componentWillUnmount ran!");
  }

  handleCheckInClick (event) {
    this.props.setOnSite(this.props.personId);
  }

  render() {

    const show = !this.props.hide;

    const carpoolSiteName = (this.props.carpoolSite) ? this.props.carpoolSites[this.props.carpoolSite]['Shortname'] : '';

    return (
      <Slide in={show} onExited={this.exited} direction="left" timeout={{enter: 0, exit: 300}}>
        <ListItem key = {this.props.personId}>
          {/* <ListItemIcon>
            {avatar}
          </ListItemIcon> */}
          <ListItemText
            primary = {this.props.firstName + ' ' + this.props.lastName}
            secondary = {carpoolSiteName}>
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton aria-label="Check In" onClick={this.handleCheckInClick}>
              <ArrowForwardIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        </Slide>
    );
  }
}

export default VolunteerListRow;
