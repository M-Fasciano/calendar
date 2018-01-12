import moment from 'moment';
import { isOutDated, addClick } from '../utility/helpers';

const calendar = () => {
  const today = moment().format('YYYY-MM-DD');
  const $now = document.getElementById('today');
  const currentDate = moment();
  const weekStart = currentDate.clone().startOf('week');
  const $calendar = document.getElementsByClassName('calendar')[0];
  const dataObj = {};

  // Insert current date to <div id="today">
  $now.textContent = moment().format('dddd Do MMM YYYY');

  // Insert data to object
  for (let i = 0; i <= 6; i++) {
    const day = moment(weekStart).add(i, 'days').format('Do');
    const year = moment(weekStart).add(i, 'days').format('YYYY');
    const month = moment(weekStart).add(i, 'days').format('MM');
    const dayShort = moment(weekStart).add(i, 'days').format('dd');
    const dayLong = moment(weekStart).add(i, 'days').format('dddd');
    const dayWeek = moment(weekStart).add(i, 'days').format('DD');
    const dateComparison = `${year}-${month}-${dayWeek}`;

    dataObj[`day_${i}`] = {
      date: day,
      year,
      month,
      dayShort,
      dayLong,
      dateComparison,
    };
  }

  // Loop through object and create a 7 days calendar
  Object.keys(dataObj).map((key) => {
    const targetDate = dataObj[key].dateComparison;
    const isOld = isOutDated(targetDate, today);

    // If day is in the past add grey out the element
    if (isOld) {
      $calendar.innerHTML += `
        <li class="calendar__item calendar__item--past" data-day="${dataObj[key].dayLong}" data-date="${dataObj[key].dateComparison}">
          ${dataObj[key].dayShort} ${dataObj[key].date}
        </li>`;
    } else {
      $calendar.innerHTML += `
        <li class="calendar__item" data-day="${dataObj[key].dayLong}" data-date="${dataObj[key].dateComparison}">
          ${dataObj[key].dayShort} ${dataObj[key].date}
        </li>`;
    }
  });

  // Toggle class active
  const addActive = (element) => {
    element.classList.toggle('active');
  };

  const elem = document.querySelectorAll('.calendar__item');
  const now = moment().format('dddd Do MMM YYYY');

  // Loop through elements
  Array.from(elem).forEach((item) => {
    const elData = item.getAttribute('data-day');
    const currentDay = now.includes(elData);
    const btn = document.querySelector('.js-reset');

    // Add class current to current day
    if (currentDay === true) {
      item.classList.add('current');
    }

    // Remove class active to all elements
    btn.addEventListener('click', () => {
      item.classList.remove('active');
    });
  });

  const dbDays = firebase.database().ref('week/');

  const addtoDb = () => {
    // get data attribute
    dbDays.update(dataObj);
  };

  // On load add data to firebase
  window.onload = () => {
    addtoDb();
  };

  addClick('.calendar__item', addActive);
  // addClick('.calendar__item', addtoDb);
};

export default calendar;
