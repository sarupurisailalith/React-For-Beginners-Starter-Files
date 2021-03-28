import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';
import PropTypes from 'prop-types';

class App extends React.Component {
    state = {
        fishes : {},
        order : {}
    };

    static propTypes = {
        match: PropTypes.object,
    }

    componentDidMount() {
        const { params } = this.props.match;
        //  reinstating local storage
        const localStorageRef = localStorage.getItem(params.storeId)
        if(localStorageRef){
            this.setState({order: JSON.parse(localStorageRef)});
        }
        this.ref = base.syncState(`${params.storeId}/fishes`, {
            context: this,
            state: 'fishes'
        });
    }

    componentDidUpdate() {
        localStorage.setItem(this.props.match.params.storeId, JSON.stringify(this.state.order));
    }

    componentWillUnmount() {
        base.remove(this.ref);
    }

    addFish = (fish) => {
        const fishes = {...this.state.fishes};
        fishes[`fish${Date.now()}`] = fish;
        this.setState({ fishes });
    };

    updateFish = (key, updatedFish) => {
        //take a copy of current state
        const fishes = {...this.state.fishes};
        // update state
        fishes[key] = updatedFish;
        // set the updated fishes object to state
        this.setState({fishes});
    };

    deleteFish = (key) => {
        // take acopy of state
        const fishes = {...this.state.fishes}
        // update the state - removing item 
        fishes[key] = null;
        // update state
        this.setState({fishes});
    };

    loadSampleFishes = () => {
        this.setState({ fishes : sampleFishes})
    };

    addToOrder = (key) => {
        // take a copy of state
        const order = {...this.state.order};
        // add to order or update the number in the order 
        order[key] = order[key] + 1 || 1;
        // call set state to update order state
        this.setState({order});
    }

    removeFromOrder = (key) => {
                // take a copy of state
                const order = {...this.state.order};
                // update order state 
                delete order[key];
                // call set state to update order state
                this.setState({order});
    }

    render() {
        return(
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="fishes">
                        {Object.keys(this.state.fishes)
                        .map(key => 
                        <Fish 
                        key={key} 
                        index={key}
                        details={this.state.fishes[key]} 
                        addToOrder={this.addToOrder} />)}
                    </ul>
                </div>
                <Order 
                fishes={this.state.fishes} 
                order={this.state.order} 
                removeFromOrder={this.removeFromOrder} />
                <Inventory 
                addFish={this.addFish}
                updateFish={this.updateFish}  
                deleteFish={this.deleteFish}
                loadSampleFishes={this.loadSampleFishes}
                fish = {this.state.fishes} 
                storeId={this.props.match.params.storeId} />
            </div>
        );
    }
}

export default App;