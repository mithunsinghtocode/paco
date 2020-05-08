import axios from 'axios';

export default axios.create({
    // baseURL: 'http://localhost:8080/paco'
    // baseURL: 'http://ioccsuat1:8080/paco'
    baseURL: window.location.href
});