/* eslint-disable no-use-before-define */
/* eslint-disable semi */
/* eslint-disable comma-spacing */
/* eslint-disable eol-last */
/* eslint-disable comma-dangle */
/* eslint-disable quote-props */
const APISettings = {
  baseURL: 'https://localhost:7056/api/',
  axiosParams (itemId = 0 , actionId = 0 , pageNumber = 1) {
    const params = new URLSearchParams();
    params.append('PageNumber', pageNumber);
    params.append('PageSize', 25);
    params.append('ItemId',itemId);
    params.append('ActionId',actionId);
    return params;
  },

  getHeaders () {
    return [
              {
                  'Accept': 'application/json',
                  'Authorization': 'bearer ' + localStorage.getItem('token')
              }
          ]
  }
}

export default APISettings
