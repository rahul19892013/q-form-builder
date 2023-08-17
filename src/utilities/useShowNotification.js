import { Notify } from 'quasar'

export const showNotification = (message, position, color, icon) => {
    Notify.create({
        message,
        position,
        color,
        icon
    })
}

export const successNotification = (message) => {
    showNotification(message, 'bottom', 'positive', 'check_circle')
}

export const errorNotification = (message) => {
    showNotification(message, 'bottom', 'negative', 'error')
}
