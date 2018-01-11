import moment from 'moment';

const isOutDated = (date, today) => {
  if (moment(date).isBefore(today)) {
    return true;
  }

  return false;
};

export default isOutDated;
