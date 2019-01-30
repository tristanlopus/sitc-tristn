import Airtable from 'airtable';
import {
  AIRTABLE,
  TIME_ZONE
} from './../constants';
import * as loglevel from 'loglevel';

function checkIn (personId, hours) {
  const myPromise = new Promise((resolve, reject) => {
    var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.BASE_ID);

    base(AIRTABLE.ATTENDANCE_TABLE).create({
      "Volunteer ID": [
        personId
      ],
      "Hours": hours,
      "On Site": false
    }, function(err, record) {
      if (err) {
        loglevel.error(err)
        reject(err);
      } else {
        loglevel.info(record.getId());
        resolve();
      }
    })
  });

  return myPromise;
}

function getAttendanceRecordsToday () {
  const myPromise = new Promise((resolve, reject) => {
    const now = new Date();
    // thanks to user113716 on SO for the clever way to add leading zeros without any comparisons
    // https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
    const nowString = now.getUTCFullYear() + "-" + ("0" + (now.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + now.getUTCDate()).slice(-2);
    loglevel.debug(nowString);

    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.BASE_ID);

    const checkedInTeers = [];

    // TODO: figure out timezone matching

    base(AIRTABLE.ATTENDANCE_TABLE).select({
      view: AIRTABLE.ATTENDANCE_VIEW,
      filterByFormula: `IS_SAME({Date}, DATETIME_PARSE('${nowString}'), 'day')`,
      timeZone: AIRTABLE.TIME_ZONE,
    }).eachPage(function page(records, fetchNextPage) {
      records.forEach(record => checkedInTeers.push(record.get('Volunteer ID')[0]));
      fetchNextPage();
    }, function done(err) {
      if (err) {
        loglevel.error(err);
      }
      resolve(checkedInTeers);
    });
  });

  return myPromise;
}

export default {
  checkIn,
  getAttendanceRecordsToday
};