import React from 'react';
import Header from './header/Header';
import Filter from './filter/Filter';
import MapChartLayer from './map/chart';

const App = () => {
    return (
        <div>
            <Header />
            <Filter />
            <MapChartLayer />
        </div>
    );
};

export default App;