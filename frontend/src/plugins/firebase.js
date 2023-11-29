import firebase from "firebase/compat/app"
import "firebase/compat/auth"

const fbConfig = {
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_PROJECT_ID,
};
firebase.initializeApp(fbConfig)

export default firebase
