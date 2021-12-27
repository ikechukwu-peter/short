/* eslint-disable */

export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement?.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type: string, msg: string, time: number = 7) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    let body = document.querySelector('body')
    if (body) body.insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 1000);
};
