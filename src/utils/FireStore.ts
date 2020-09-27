import { isNil } from 'ramda'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export default class FireStore {
  private static instance: firebase.firestore.Firestore

  static getInstance() {
    if (!this.instance) {
      if (isNil(process.env.REACT_APP_FIREBASE_CONFIG)) {
        throw Error('Failed to getting REACT_APP_FIREBASE_CONFIG')
      }
      const firebaseConfig = JSON.parse(window.atob(process.env.REACT_APP_FIREBASE_CONFIG))
      this.instance = firebase.initializeApp(firebaseConfig).firestore()
    }

    return this.instance
  }
}
