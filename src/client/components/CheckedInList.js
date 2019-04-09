import React from 'React';
import Airtable from 'airtable';
import * as loglevel from 'loglevel';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import CheckedInListRow from './CheckedInListRow';
import sitcAirtable from './../api/sitcAirtable';

const styles = theme => ({
});

class CheckedInList extends React.Component {

  constructor () {
    super();

    this.checkOut = this.checkOut.bind(this);
  }

  componentDidMount () {
    loglevel.info("mounted CheckedInList!");
    this.props.setTabIndex(1);
  }

  checkOut (attendanceRecordId, personId) {
    this.props.checkOutHandler(attendanceRecordId, personId)
  }

  render () {
    const teerListItems = [];
    for (const attendanceRecordId in this.props.checkedInTeers) {
      const personId = this.props.checkedInTeers[attendanceRecordId];
      teerListItems.push(
        <CheckedInListRow
          personId = {personId}
          attendanceRecordId = {attendanceRecordId}
          firstName = {this.props.volunteerInfo[personId]['First Name']}
          lastName = {this.props.volunteerInfo[personId]['Last Name']}
          paid = {this.props.volunteerInfo[personId]['Paid']}
          hours = {this.props.volunteerInfo[personId]['Hours Credited']}
          hasCar = {this.props.volunteerInfo[personId]['Has Car']}
          checkOut = {this.checkOut}
        />
      );
    }

    return (
      <List>
        {teerListItems}
      </List>
    );
  }

}

export default withStyles(styles)(CheckedInList);
