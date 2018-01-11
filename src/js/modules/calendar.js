import moment from 'moment';
import isOutDated from '../utility/helpers';

const calendar = () => {
  const today = moment().format('YYYY-MM-DD');
  const $now = document.getElementById('today');
  const currentDate = moment();
  const weekStart = currentDate.clone().startOf('week');
  const $calendar = document.getElementsByClassName('calendar')[0];
  const dataObj = {};

  // Insert current date to <div id="today">
  $now.textContent = moment().format('dddd Do MMM YYYY');

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

  Object.keys(dataObj).map((key) => {
    const targetDate = dataObj[key].dateComparison;
    const isOld = isOutDated(targetDate, today);

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

  const addClick = (element, action) => {
    const el = document.querySelectorAll(element);

    Array.from(el).forEach((item) => {
      item.addEventListener('click', () => {
        action(item);
      });
    });
  };

  const addActive = (element) => {
    element.classList.toggle('active');
  };

  const elem = document.querySelectorAll('.calendar__item');
  const now = moment().format('dddd Do MMM YYYY');

  Array.from(elem).forEach((item) => {
    const elData = item.getAttribute('data-day');
    const currentDay = now.includes(elData);
    const btn = document.querySelector('.js-reset');

    if (currentDay === true) {
      item.classList.add('current');
    }

    btn.addEventListener('click', () => {
      item.classList.remove('active');
    });
  });

  const dbDays = firebase.database().ref('week/');

  const addtoDb = () => {
    // get data attribute
    dbDays.update(dataObj);
  };

  window.onload = () => {
    addtoDb();
  };

  addClick('.calendar__item', addActive);
  // addClick('.calendar__item', addtoDb);
};

export default calendar;
