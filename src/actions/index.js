
const AppData = {
    name: 'Pax ConnX Optimiser',
    author: 'Mithun Singh',
    description: 'Used to Monitor the inbound and outbound connections of pax',
    version: 'Alpha 1.0.0'
};

export const fetchAppData = () => dispatch => {
        //const response = await api.get('/inboundFlights');
        dispatch({ type: 'NO_ACTION_TAKEN', payload: AppData});
};