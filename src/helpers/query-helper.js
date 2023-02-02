/**
 * Convert data before send request
 * @returns {*}
 * @param form
 */

let query = function buildQuery(form) {
  let params = {};
  for (let index in form) {
    let key = form[index].name;
    params[key] = form[index].value;
  }

  return params;
};

let buildFormData = function buildFormData(items) {
  let formData = new FormData();
  for (let key in items) {
    // eslint-disable-next-line no-prototype-builtins
    if (items.hasOwnProperty(key) && items[key] !== null) {
      formData.append(key, items[key]);
    }
  }
  return formData;
};

export default {
  buildQuery: query,
  buildFormData: buildFormData
};
