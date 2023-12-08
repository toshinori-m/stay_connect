import firebase from "@/plugins/firebase"
import axios from "@/plugins/axios"

const authCheck = ({ store, redirect }) => {
  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      const { data } = await axios.get('/users', {
        params: {
          uid: user.uid,
        },
      })
      store.dispatch("auth/setUser", data)
    } else {
      store.dispatch("auth/setUser", null)
    }
  })
}

export default authCheck
