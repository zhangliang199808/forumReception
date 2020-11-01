import axios from 'axios';


const service = axios.create({
    timeout: 6000
});

const token = localStorage.getItem('token')
service.interceptors.request.use(
    config => {
        if (token) {
            config.headers['Authorization'] = token
        }
        if (config.method == 'post') {
            config.headers['Content-type'] = 'application/x-www-form-urlencoded'
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
