/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.remove();
};

// type is 'success' or 'error'
export const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const el = document.createElement('div');
  el.className = `alert alert--${type}`;
  el.textContent = msg;
  document.querySelector('body').insertAdjacentElement('afterbegin', el);
  window.setTimeout(hideAlert, time * 1000);
};
