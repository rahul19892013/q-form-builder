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
                  'Authorization': 'bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbiIsIm5iZiI6MTY4MTk4NjY3NSwiZXhwIjoxNjgyMDczMDc1LCJpYXQiOjE2ODE5ODY2NzV9.e9COmJi8ddd_BN6LQ6S5tZTK54MoqdM9jRyWlwcM0bI3QRoBjkkz5whzfremH96DWcVaE4-DS12YiWqxMkP5yQ',
              }
          ]
  }
}

export default APISettings
