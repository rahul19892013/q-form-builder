import { Dialog } from 'quasar'
import { postRequest } from '../services/api.services'
import {
  errorNotification,
  successNotification
} from '../utilities/useShowNotification'

export const toPascalCase = str =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join('')

export const showLoginDialog = () => {
  Dialog.create({
    title: 'Login',
    message: '',
    prompt: {
      model: '',
      type: 'password',
      isValid: val => val.length > 6, // << here is the magic
      label: 'Enter Admin Password' // optional
    },
    cancel: 'Cancel',
    ok: 'Login'
  }).onOk(data => Login(data))
}

const Login = data => {
  postRequest('Auth', { userName: 'admin', password: data }).then(response => {
    if (response.success) {
      localStorage.setItem('token', response.data)
      successNotification(response.message)
    } else {
      errorNotification(response.message)
    }
  })
}
