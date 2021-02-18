import Axios from 'axios';

    // Axios.defaults.baseURL = 'https://api.360app.io/api' ;
 Axios.defaults.baseURL = 'http://13.211.132.117:3600'
Axios.defaults.headers.common.Accept = 'application/json';
Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default Axios;
