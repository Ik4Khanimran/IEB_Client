import axios from 'axios';

// Set Axios defaults for CSRF token handling and credentials
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

export default axios;
