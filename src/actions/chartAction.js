
export const initChart = (chart) => dispatch => {
        //const response = await api.get('/inboundFlights');
        dispatch({ type: 'CHART_INIT', payload: chart});
};