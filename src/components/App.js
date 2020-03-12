import React from 'react';
import Header from './header/Header';
import Filter from './filter/Filter';
import MapChartLayer from './map/chart';
import FocusView from './focusview/FocusView';

const App = () => {
    return (
        <div>
            <Header />
            <Filter />
            <MapChartLayer />
            < FocusView />
        </div>
    );
};

export default App;