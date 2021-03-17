import React from 'react';
import {getFunName} from '../helpers';

class StorePicker extends React.Component {

    myInput = React.createRef();

    goToStore = (event) => {
        // stop form from submitting
        event.preventDefault();
        // get text from the input
        const storeName = this.myInput.current.defaultValue;
        // change the page url to /store/text
        this.props.history.push(`/store/${storeName}`);
    };

    render() {
        return <form className="store-selector" onSubmit={this.goToStore}>
            <h2>Please Enter a Store</h2>
            <input 
                type="text" 
                required 
                ref={this.myInput}
                placeholder="Store Name" 
                defaultValue={getFunName()}/>
            <button type="submit"> Visit Store &rarr;</button>
        </form>
    }
}

export default StorePicker;