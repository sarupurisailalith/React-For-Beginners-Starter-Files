import React from 'react';
import AddFishForm from './AddFishForm';
import EditFishForm from './EditFishForm';
import PropTypes from 'prop-types';
import Login from './Login';
import firebase from 'firebase';
import base, {firebaseApp} from "../base";

class Inventory extends React.Component {

    static propTypes = {
        fish : PropTypes.object.isRequired,
        updateFish : PropTypes.func.isRequired,
        deleteFish : PropTypes.func.isRequired,
        loadSampleFishes : PropTypes.func.isRequired,
    };

    state = {
        uid: null, 
        owner: null,
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.authHandler({user});
            }
        })
    }

    authHandler = async (authData) => {
        // look up the current store in firestore database 
        const store = await base.fetch(this.props.storeId, {context: this});
        // claim if there is no owner 
        if(!store.owner) {
            await base.post(`${this.props.storeId}/owner`, {
                data: authData.user.uid,
            })
        }
        // set the state of inventory component to reflect current user 
        this.setState({ 
            uid: authData.user.uid,
            owner: store.owner || authData.user.uid,
        });
    };

    authenticate = (provider) => {
        const authProvider = new firebase.auth[`${provider}AuthProvider`]();
        firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
    };

    logout = async () => {
        await firebase.auth().signOut();
        this.setState({ uid: null});
    };

    render() {

        const logoutBtn = <button onClick={this.logout}>Log Out!</button>

        // check if logged in 
        if(!this.state.uid) {
            return <Login authenticate={this.authenticate}/>;
        }
        //check if they are not the owner of the store
        if(this.state.uid !== this.state.owner){
            return <div>
                <p>Sorry you are not the Owner!</p>
                {logoutBtn}
            </div>
        }

        // For the store owners 
        return (
        <div className="Inventory">
            <h2>Inventory</h2>
            {logoutBtn}
            {Object.keys(this.props.fish).map(key => <EditFishForm 
            key={key}
            index={key} 
             fish={this.props.fish[key]} 
             updateFish={this.props.updateFish} 
             deleteFish={this.props.deleteFish} />)}
            <AddFishForm addFish={this.props.addFish}/>
            <button onClick={this.props.loadSampleFishes}>Load Sample Fishes</button>
        </div>
        )
    }
}

export default Inventory;