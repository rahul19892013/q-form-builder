import { AppFullscreen, Notify, Dialog, Loading } from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'

// To be used on app.use(Quasar, { ... })
export default {
    config: {
        brand: {
            primary: '#595c56',
            secondary: '#7c9a2b',
            accent: '#007cc4',
            dark: '#3b3b3b',
            positive: '#66c300',
            negative: '#d40b0b',
            info: '#007cc4',
            warning: '#e67811'
        },
        loading: { spinnerSize: 45 }
    },
    animations: [
        'fadeIn'
    ],
    plugins: {
        AppFullscreen,
        Notify,
        Dialog,
        Loading
    }
}
