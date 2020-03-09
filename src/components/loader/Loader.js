import React from 'react';

const Loader = (props) => {

    console.log(props);
    return (
        <div className="ui active dimmer">
            <div className="ui big text loader">{props.loader}</div>
        </div>
    );

};

Loader.defaultProps = {
    loader: 'Loading...'
};

export default Loader;