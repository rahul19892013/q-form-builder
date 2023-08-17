import axios from 'axios'

import APISettings from '../config/ApiSettings'
import { showLoginDialog } from '../utilities/common'
import { errorNotification } from '../utilities/useShowNotification'

export const getRequest = (url, loader = true) =>
  new Promise((resolve, reject) => {
    axios
      .get(APISettings.baseURL + url, {
        headers: APISettings.getHeaders()[0]
        //  ,params: APISettings.axiosParams(3, 7)
      })
      .then(res => {
        resolve(res.data.data.records)
      })
      .catch(async error => {
        if (typeof (error.response) !== 'undefined') {
        if (error.response.status === 401) {
          showLoginDialog()
        }
      } else {
        errorNotification(error.message)
      }
        reject(error)
      })
      .finally(() => {
        // if (loader) Loading.hide();
      })
  })

export const putRequest = (url, data, loader = true) =>
  new Promise((resolve, reject) => {
    axios
      .put(APISettings.baseURL + url, data, {
        headers: APISettings.getHeaders()[0]
      })
      .then(response => {
        resolve(response)
      })
      .catch(async error => {
        if (typeof (error.response) !== 'undefined') {
        if (error.response.status === 401) {
          showLoginDialog()
        }
      } else {
        errorNotification(error.message)
      }
        reject(error)
      })
      .finally(() => {
        // if (loader) Loading.hide()
      })
  })

export const postRequest = (url, data, loader = true) =>
  new Promise((resolve, reject) => {
    axios
      .post(APISettings.baseURL + url, data, {
        headers: APISettings.getHeaders()[0]
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(async error => {
        if (typeof (error.response) !== 'undefined') {
        if (error.response.status === 401) {
          showLoginDialog()
        }
      } else {
        errorNotification(error.message)
      }
        reject(error)
      })
      .finally(() => {
        // if (loader) Loading.hide();
      })
  })

export const deleteRequest = (url, loader = true) =>
  new Promise((resolve, reject) => {
    axios
      .delete(APISettings.baseURL + url, {
        headers: APISettings.getHeaders()[0]
      })
      .then(response => {
        resolve(response)
      })
      .catch(async error => {
        if (typeof (error.response) !== 'undefined') {
        if (error.response.status === 401) {
          showLoginDialog()
        }
      } else {
        errorNotification(error.message)
      }
        reject(error)
      })
      .finally(() => {
        // if (loader) Loading.hide();
      })
  })
