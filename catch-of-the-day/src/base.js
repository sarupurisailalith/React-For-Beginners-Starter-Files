import Rebase from 're-base';
import firebase from 'firebase';


const firebaseApp = firebase.initializeApp(
    {
        apiKey: "AIzaSyBlt7SrjT36kDXDTXoMbasMbdJTIMvnDHs",
        authDomain: "catch-of-the-day-b6c0c.firebaseapp.com",
        databaseURL: "https://catch-of-the-day-b6c0c-default-rtdb.firebaseio.com",
      }
)

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;
