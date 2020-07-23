import React from 'react';

const Loader = (props) => {
    return (
        <div className="ui active dimmer" id="loader">
            <div className="ui big text loader">{props.loader}</div>
        </div>
    );

};

Loader.defaultProps = {
    loader: 'Loading...'
};

export default Loader;