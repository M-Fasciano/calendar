import moment from 'moment';

export const addClick = (element, action) => {
  const el = document.querySelectorAll(element);

  Array.from(el).forEach((item) => {
    item.addEventListener('click', () => {
      action(item);
    });
  });
};

export const isOutDated = (date, today) => {
  if (moment(date).isBefore(today)) {
    return true;
  }

  return false;
};
